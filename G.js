// <!--GAMFC-->Last update: 2025-01-14 14:02:17 UTC - NiREvil - version base on commit 2a0decb92f508b3fd8d17ecbbe426f6868d04aaf<!--GAMFC-END-->.
// @ts-nocheck
import { connect } from 'cloudflare:sockets';

// basic encoding/decoding utilities (فقط برای کانفیگ‌ها استفاده می‌شه، نه مبهم‌سازی کل کد)
function encodeSecure(str) {
  return btoa(str.split('').reverse().join(''));
}

function decodeSecure(encoded) {
  return atob(encoded).split('').reverse().join('');
}

// encoded constants (فقط برای VLESS و WS و غیره)
const ENCODED = {
  NETWORK: 'c3c=', // ws reversed + base64
  TYPE: 'YW5haWQ=', // diana reversed + base64
  STREAM: 'bWFlcnRz', // stream reversed + base64
  PROTOCOL: 'c3NlbHY=', // vless reversed + base64
};

let userCode = '10e894da-61b1-4998-ac2b-e9ccb6af9d30';
let proxyIP = 'turk.radicalization.ir';

if (!isValidUserCode(userCode)) {
  throw new Error('user code is not valid');
}

export default {
  async fetch(request, env, ctx) {
    try {
      userCode = env.UUID || userCode;
      proxyIP = env.PROXYIP || proxyIP;
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        const url = new URL(request.url);
        switch (url.pathname) {
          case '/':
            return new Response(JSON.stringify(request.cf, null, 4), {
              status: 200,
              headers: { 'Content-Type': 'application/json;charset=utf-8' },
            });
          case `/${userCode}`: {
            const streamConfig = getDianaConfig(userCode, request.headers.get('Host'));
            return new Response(`${streamConfig}`, {
              status: 200,
              headers: { 'Content-Type': 'text/html;charset=utf-8' },
            });
          }
          default:
            return new Response('Not found', { status: 404 });
        }
      } else {
        return await streamOverWSHandler(request);
      }
    } catch (err) {
      return new Response(err.toString());
    }
  },
};

async function streamOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();

  let address = '', portWithRandomLog = '';
  const log = (info, event) => console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
  let remoteSocketWrapper = { value: null }, udpStreamWrite = null, isDns = false;

  readableWebSocketStream.pipeTo(new WritableStream({
    async write(chunk, controller) {
      if (isDns && udpStreamWrite) return udpStreamWrite(chunk);
      if (remoteSocketWrapper.value) {
        const writer = remoteSocketWrapper.value.writable.getWriter();
        await writer.write(chunk);
        writer.releaseLock();
        return;
      }
      const { hasError, message, portRemote = 443, addressRemote = '', rawDataIndex, streamVersion = new Uint8Array([0, 0]), isUDP } = processStreamHeader(chunk, userCode);
      address = addressRemote; portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '}`;
      if (hasError) throw new Error(message);
      if (isUDP) {
        if (portRemote === 53) isDns = true;
        else throw new Error('UDP proxy only enable for DNS which is port 53');
      }
      const streamResponseHeader = new Uint8Array([streamVersion[0], 0]);
      const rawClientData = chunk.slice(rawDataIndex);
      if (isDns) {
        const { write } = await handleUDPOutBound(webSocket, streamResponseHeader, log);
        udpStreamWrite = write;
        udpStreamWrite(rawClientData);
        return;
      }
      handleTCPOutBound(remoteSocketWrapper, addressRemote, portRemote, rawClientData, webSocket, streamResponseHeader, log);
    },
    close() { log('readableWebSocketStream is close'); },
    abort(reason) { log('readableWebSocketStream is abort', JSON.stringify(reason)); }
  })).catch(err => log('readableWebSocketStream pipeTo error', err));

  return new Response(null, { status: 101, webSocket: client });
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener('message', event => {
        if (readableStreamCancel) return;
        controller.enqueue(event.data);
      });
      webSocketServer.addEventListener('close', () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) return;
        controller.close();
      });
      webSocketServer.addEventListener('error', err => {
        log('webSocketServer has error');
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) controller.error(error);
      else if (earlyData) controller.enqueue(earlyData);
    },
    cancel(reason) {
      if (readableStreamCancel) return;
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    }
  });
  return stream;
}

function processStreamHeader(chunk, userCode) {
  if (chunk.byteLength < 24) return { hasError: true, message: 'invalid data' };
  const version = new Uint8Array(chunk.slice(0, 1));
  let isValidUser = false, isUDP = false;
  if (stringify(new Uint8Array(chunk.slice(1, 17))) === userCode) isValidUser = true;
  if (!isValidUser) return { hasError: true, message: 'invalid user' };
  const optLength = new Uint8Array(chunk.slice(17, 18))[0];
  const command = new Uint8Array(chunk.slice(18 + optLength, 19 + optLength))[0];
  if (command === 1) {}
  else if (command === 2) isUDP = true;
  else return { hasError: true, message: `command ${command} is not supported` };
  const portIndex = 19 + optLength;
  const portRemote = new DataView(chunk.slice(portIndex, portIndex + 2)).getUint16(0);
  let addressIndex = portIndex + 2;
  const addressType = new Uint8Array(chunk.slice(addressIndex, addressIndex + 1))[0];
  let addressLength = 0, addressValueIndex = addressIndex + 1, addressValue = '';
  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(chunk.slice(addressValueIndex, addressValueIndex + addressLength)).join('.');
      break;
    case 2:
      addressLength = new Uint8Array(chunk.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(chunk.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(chunk.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) ipv6.push(dataView.getUint16(i * 2).toString(16));
      addressValue = ipv6.join(':');
      break;
    default:
      return { hasError: true, message: `invalid addressType: ${addressType}` };
  }
  if (!addressValue) return { hasError: true, message: 'addressValue is empty' };
  return { hasError: false, addressRemote: addressValue, addressType, portRemote, rawDataIndex: addressValueIndex + addressLength, streamVersion: version, isUDP };
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, streamResponseHeader, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({ hostname: address, port });
    remoteSocket.value = tcpSocket;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket;
  }
  async function retry() {
    const tcpSocket = await connectAndWrite(proxyIP || addressRemote, portRemote);
    tcpSocket.closed.catch(error => console.log('retry tcpSocket closed error', error)).finally(() => safeCloseWebSocket(webSocket));
    remoteSocketToWS(tcpSocket, webSocket, streamResponseHeader, null, log);
  }
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS(tcpSocket, webSocket, streamResponseHeader, retry, log);
}

async function remoteSocketToWS(remoteSocket, webSocket, streamResponseHeader, retry, log) {
  let vlessHeader = streamResponseHeader, hasIncomingData = false;
  await remoteSocket.readable.pipeTo(new WritableStream({
    async write(chunk, controller) {
      hasIncomingData = true;
      if (webSocket.readyState !== 1) controller.error('webSocket is not open');
      if (vlessHeader) {
        webSocket.send(await new Blob([vlessHeader, chunk]).arrayBuffer());
        vlessHeader = null;
      } else webSocket.send(chunk);
    },
    close() { log('remoteConnection readable close'); },
    abort(reason) { console.error('remoteConnection readable abort', reason); }
  })).catch(error => {
    console.error('remoteSocketToWS has error', error.stack || error);
    safeCloseWebSocket(webSocket);
  });
  if (!hasIncomingData && retry) {
    log('retry connection');
    retry();
  }
}

async function handleUDPOutBound(webSocket, streamResponseHeader, log) {
  let isHeaderSent = false;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      for (let index = 0; index < chunk.byteLength;) {
        const lengthBuffer = chunk.slice(index, index + 2);
        const udpPacketLength = new DataView(lengthBuffer).getUint16(0);
        const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPacketLength));
        index += 2 + udpPacketLength;
        controller.enqueue(udpData);
      }
    }
  });
  transformStream.readable.pipeTo(new WritableStream({
    async write(chunk) {
      const resp = await fetch('https://1.1.1.1/dns-query', {
        method: 'POST',
        headers: { 'content-type': 'application/dns-message' },
        body: chunk
      });
      const dnsQueryResult = await resp.arrayBuffer();
      const udpSize = dnsQueryResult.byteLength;
      const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
      if (webSocket.readyState === 1) {
        log(`dns query success, length: ${udpSize}`);
        if (isHeaderSent) webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
        else {
          webSocket.send(await new Blob([streamResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
          isHeaderSent = true;
        }
      }
    }
  })).catch(error => log('dns query error: ' + error));
  const writer = transformStream.writable.getWriter();
  return { write: chunk => writer.write(chunk) };
}

function getDianaConfig(userCode, hostName) {
  const protocol = decodeSecure(ENCODED.PROTOCOL);
  const networkType = decodeSecure(ENCODED.NETWORK);
  const baseUrl = `${protocol}://${userCode}@${hostName}:443`;
  const commonParams = `encryption=none&host=${hostName}&type=${networkType}&security=tls&sni=${hostName}`;
  const freedomConfig = `${baseUrl}?path=%2Fapi%2Fv1&eh=Sec-WebSocket-Protocol&ed=2560&${commonParams}&fp=chrome&alpn=h3#${hostName}`;
  const dreamConfig = `${baseUrl}?path=%2Fapi%2Fv8%3Fed%3D2048&${commonParams}&fp=firefox&alpn=h2%2Chttp%2F1.1#${hostName}`;
  const singBoxConfig = {
    outbounds: [{
      type: decodeSecure(ENCODED.PROTOCOL), tag: "proxy", server: hostName, server_port: 443, uuid: userCode, flow: "",
      tls: { enabled: true, server_name: hostName, insecure: false, alpn: ["h3"] },
      transport: { type: decodeSecure(ENCODED.NETWORK), path: "/api/v1", headers: { Host: hostName }, early_data_header_name: "Sec-WebSocket-Protocol", max_early_data: 2560 }
    }]
  };
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <title>REvil VLESS-Proxy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #0C0C0C; color: #E5E5E5; padding: 20px; line-height: 1.5; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-weight: 600; color: #FFFFFF; font-size: 24px; margin-bottom: 8px; }
        .header p { color: #A3A3A3; font-size: 14px; }
        .config-card { background: #1A1A1A; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #262626; }
        .config-title { font-size: 16px; font-weight: 600; color: #FFFFFF; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #262626; }
        .config-content { position: relative; background: #262626; border-radius: 8px; padding: 15px 70px 15px 15px; margin-bottom: 15px; white-space: nowrap; overflow-x: auto; font-family: 'Monaco', monospace; font-size: 13px; line-height: 1.4; color: #E5E5E5; }
        .attributes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; padding: 15px; background: #262626; border-radius: 8px; }
        .attribute { display: flex; flex-direction: column; gap: 5px; }
        .attribute span { font-size: 13px; color: #A3A3A3; }
        .attribute strong { font-size: 14px; color: #FFFFFF; word-break: break-all; }
        .copy-btn { position: absolute; top: 10px; right: 10px; background: #FF7A3D; color: #000000; border: 1px solid #FF7A3D; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; }
        .copy-btn:hover { background: #000000; color: #FF7A3D; transform: scale(1.05); }
        .client-buttons { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 15px; }
        .client-btn { display: flex; align-items: center; gap: 8px; background: #262626; padding: 12px; border-radius: 8px; font-size: 13px; color: #E5E5E5; text-decoration: none; border: 1px solid #404040; transition: all 0.2s ease; }
        .client-btn:hover { background: #333333; border-color: #FF7A3D; transform: translateY(-2px); }
        .client-icon { width: 24px; height: 24px; border-radius: 6px; background-color: #333; display: flex; align-items: center; justify-content: center; }
        .footer { text-align: center; margin-top: 30px; color: #737373; font-size: 13px; }
        @media (max-width: 600px) {
            .container { padding: 0; }
            .config-card { padding: 15px; border-radius: 8px; }
            .config-content { padding: 12px 60px 12px 12px; font-size: 12px; }
            .attributes { grid-template-columns: 1fr; gap: 10px; padding: 12px; }
            .client-buttons { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
            .client-btn { padding: 10px; }
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #262626; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #525252; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VLESS Proxy Configurations</h1>
            <p>Copy the configuration to import into your preferred client</p>
        </div>
        <div class="config-card">
            <div class="config-title">Proxy Information</div>
            <div class="attribute">
                <div class="attribute"><span>Proxy IP:</span><strong>${proxyIP}</strong></div>
                <div class="attribute"><span>Status:</span><strong>Active</strong></div>
            </div>
        </div>
        <div class="config-card">
            <div class="config-title">Xray Core Clients</div>
            <div class="config-content">
                <button class="copy-btn" onclick="copyToClipboard(this, '${dreamConfig}')">Copy</button>
                ${dreamConfig}
            </div>
            <div class="client-buttons">
                <a href="hiddify://import-remote-profile?url=${encodeURIComponent(dreamConfig)}" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/hiddify-logo.svg" width="16" height="16" alt="Hiddify"></div>Import to Hiddify
                </a>
                <a href="v2rayng://install-config?url=${encodeURIComponent(dreamConfig)}" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/v2rayng-logo.svg" width="16" height="16" alt="V2rayNG"></div>Import to V2rayNG
                </a>
                <a href="v2rayng://install-config?url=${encodeURIComponent(dreamConfig)}" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/mahsang-logo.svg" width="16" height="16" alt="MahsaNG"></div>Import to MahsaNG
                </a>
            </div>
        </div>
        <div class="config-card">
            <div class="config-title">Sing-Box Core Clients</div>
            <div class="config-content">
                <button class="copy-btn" onclick="copyToClipboard(this, '${freedomConfig}')">Copy</button>
                ${freedomConfig}
            </div>
            <div class="client-buttons">
                <a href="#" onclick="importToSingBox()" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/singbox-logo.svg" width="16" height="16" alt="Sing-Box"></div>Import to Sing-Box
                </a>
                <a href="#" onclick="importToNekoBox()" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/nekobox-logo.svg" width="16" height="16" alt="NekoBox"></div>Import to NekoBox
                </a>
                <a href="#" onclick="importToShadowrocket()" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/shadowrocket-logo.svg" width="16" height="16" alt="Shadowrocket"></div>Import to Shadowrocket
                </a>
                <a href="#" onclick="importToStreisand()" class="client-btn">
                    <div class="client-icon"><img src="https://example.com/streisand-logo.svg" width="16" height="16" alt="Streisand"></div>Import to Streisand
                </a>
            </div>
        </div>
        <div class="footer"><p>© 2025 REvil, All Rights Reserved</p></div>
    </div>
    <script>
        const singBoxConfig = ${JSON.stringify(singBoxConfig)};
        function importToSingBox() {
            const encodedConfig = btoa(JSON.stringify(singBoxConfig));
            window.location.href = 'sing-box://import-config?config=' + encodedConfig;
        }
        function importToNekoBox() {
            const encodedConfig = btoa(JSON.stringify(singBoxConfig));
            window.location.href = 'nekobox://install-config?config=' + encodedConfig;
        }
        function importToShadowrocket() {
            window.location.href = 'shadowrocket://add/' + encodeURIComponent('${freedomConfig}');
        }
        function importToStreisand() {
            window.location.href = 'streisand://add/' + encodeURIComponent('${freedomConfig}');
        }
        function copyToClipboard(button, text) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#FF7A3D';
                button.style.color = '#000000';
                setTimeout(() => { button.textContent = originalText; button.style.background = '#FF7A3D'; }, 1000);
            });
        }
    </script>
</body>
</html>`;
}

function isValidUserCode(code) {
  const codeRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return codeRegex.test(code);
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) return { error: null };
  try {
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arrayBuffer = Uint8Array.from(decode, c => c.charCodeAt(0));
    return { earlyData: arrayBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === 1 || socket.readyState === 2) socket.close();
  } catch (error) {
    console.error('safeCloseWebSocket error', error);
  }
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));

function stringify(arr, offset = 0) {
  const uuid = (
    byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' +
    byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' +
    byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]
  ).toLowerCase();
  if (!isValidUserCode(uuid)) throw TypeError('Stringified UUID is invalid');
  return uuid;
}

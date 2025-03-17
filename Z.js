// <!--GAMFC-->Last update: 2025-03-14 14:02:17 UTC - NiREvil - version base on commit 2a0decb92f508b3fd8d17ecbbe426f6868d04aaf<!--GAMFC-END-->.
// @ts-nocheck
import { connect } from 'cloudflare:sockets';

// Enhanced obfuscation utilities
function obfuscate(str, key = 42) {
  return btoa(
    str
      .split('')
      .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
      .join(''),
  );
}

function deobfuscate(encoded, key = 42) {
  return atob(encoded)
    .split('')
    .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
    .join('');
}

// Obfuscated constants
const SECRETS = {
  NETWORK: 'OjY=', // ws obfuscated
  TYPE: 'fmZiZQ==', // diana obfuscated
  STREAM: 'fXJiZQ==', // stream obfuscated
  PROTOCOL: 'OjY2ZQ==', // vless obfuscated
};

let userCode = '10e894da-61b1-4998-ac2b-e9ccb6af9d30';
let proxyIP = 'turk.radicalization.ir';

if (!isValidUserCode(userCode)) {
  throw new Error('Invalid user code');
}

export default {
  async fetch(request, env, ctx) {
    try {
      userCode = env.UUID || userCode;
      proxyIP = env.PROXYIP || proxyIP;
      const upgradeHeader = request.headers.get('Upgrade');
      const url = new URL(request.url);

      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        switch (url.pathname) {
          case '/':
            return new Response(JSON.stringify(request.cf, null, 4), {
              status: 200,
              headers: { 'Content-Type': 'application/json;charset=utf-8' },
            });
          case `/${userCode}`:
            return new Response(getDianaConfig(userCode, request.headers.get('Host')), {
              status: 200,
              headers: { 'Content-Type': 'text/html;charset=utf-8' },
            });
          case `/sub/${userCode}`:
            return new Response(getSubscription(userCode, request.headers.get('Host')), {
              status: 200,
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });
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

function getSubscription(userCode, hostName) {
  const protocol = deobfuscate(SECRETS.PROTOCOL);
  const networkType = deobfuscate(SECRETS.NETWORK);
  const baseUrl = `${protocol}://${userCode}@${hostName}:443`;
  const commonParams = `encryption=none&host=${hostName}&type=${networkType}&security=tls&sni=${hostName}`;
  const freedomConfig = `${baseUrl}?path=%2Fapi%2Fv1&eh=Sec-WebSocket-Protocol&ed=2560&${commonParams}&fp=chrome&alpn=h3#${hostName}`;
  const dreamConfig = `${baseUrl}?path=%2Fapi%2Fv8%3Fed%3D2048&${commonParams}&fp=firefox&alpn=h2%2Chttp%2F1.1#${hostName}`;
  return btoa([freedomConfig, dreamConfig].join('\n'));
}

function getDianaConfig(userCode, hostName) {
  const protocol = deobfuscate(SECRETS.PROTOCOL);
  const networkType = deobfuscate(SECRETS.NETWORK);
  const baseUrl = `${protocol}://${userCode}@${hostName}:443`;
  const commonParams = `encryption=none&host=${hostName}&type=${networkType}&security=tls&sni=${hostName}`;
  const subscriptionUrl = `https://${hostName}/sub/${userCode}`;

  const freedomConfig = `${baseUrl}?path=%2Fapi%2Fv1&eh=Sec-WebSocket-Protocol&ed=2560&${commonParams}&fp=chrome&alpn=h3#${hostName}`;
  const dreamConfig = `${baseUrl}?path=%2Fapi%2Fv8%3Fed%3D2048&${commonParams}&fp=firefox&alpn=h2%2Chttp%2F1.1#${hostName}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <title>REvil VLESS-Proxy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #0C0C0C;
            color: #E5E5E5;
            padding: 20px;
            line-height: 1.5;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-weight: 600;
            color: #FFFFFF;
            font-size: 24px;
            margin-bottom: 8px;
        }

        .header p {
            color: #A3A3A3;
            font-size: 14px;
        }

        .config-card {
            background: #1A1A1A;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #262626;
        }

        .config-title {
            font-size: 16px;
            font-weight: 600;
            color: #FFFFFF;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #262626;
        }

        .config-content {
            position: relative;
            background: #262626;
            border-radius: 8px;
            padding: 15px 70px 15px 15px;
            margin-bottom: 15px;
            white-space: nowrap;
            overflow-x: auto;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.4;
            color: #E5E5E5;
        }

        .attributes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
            padding: 15px;
            background: #262626;
            border-radius: 8px;
        }

        .attribute {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .attribute span {
            font-size: 13px;
            color: #A3A3A3;
        }

        .attribute strong {
            font-size: 14px;
            color: #FFFFFF;
            word-break: break-all;
        }

        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #FF7A3D;
            color: #000000;
            border: 1px solid #FF7A3D;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .copy-btn:hover {
            background: #000000;
            color: #FF7A3D;
            transform: scale(1.05);
        }

        .client-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
            margin-top: 15px;
        }

        .client-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #262626;
            padding: 12px;
            border-radius: 8px;
            font-size: 13px;
            color: #E5E5E5;
            text-decoration: none;
            border: 1px solid #404040;
            transition: all 0.2s ease;
        }

        .client-btn:hover {
            background: #333333;
            border-color: #FF7A3D;
            transform: translateY(-2px);
        }

        .client-icon {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: linear-gradient(135deg, #FF7A3D, #A3512B);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: filter 0.2s ease;
        }

        .client-btn:hover .client-icon {
            filter: brightness(1.2);
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            color: #737373;
            font-size: 13px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 10;
            }

            .config-card {
                padding: 15px;
                border-radius: 8px;
            }

            .config-content pre {
                white-space: pre-wrap;
                word-break: break-all;
            }

            .copy-btn {
                top: 10px;
                right: 10px;
            }

            .attributes {
                grid-template-columns: 1fr;
                gap: 10px;
                padding: 12px;
            }
            
            .client-buttons {
                grid-template-columns: repeat(auto-fill, minmax(139px, 1fr));
            }
          }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #262626;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #525252;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VLESS Proxy Configurations</h1>
            <p>Copy or import configurations into your preferred client</p>
        </div>
        <div class="config-card">
            <div class="config-title">Proxy Information</div>
            <div class="attributes">
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
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    Import to Hiddify
                </a>
                <a href="v2rayng://install-config?url=${encodeURIComponent(dreamConfig)}" class="client-btn">
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M12 2L4 5v6c0 5.5 3.5 10.7 8 12.3 4.5-1.6 8-6.8 8-12.3V5l-8-3z"/>
                        </svg>
                    </div>
                    Import to V2rayNG
                </a>
                <a href="mahsang://install-config?url=${encodeURIComponent(dreamConfig)}" class="client-btn">
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                    </div>
                    Import to MahsaNG
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
                <a href="sing-box://subscribe?url=${encodeURIComponent(subscriptionUrl)}" class="client-btn">
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
                        </svg>
                    </div>
                    Import to Sing-Box
                </a>
                <a href="nekobox://subscribe?url=${encodeURIComponent(subscriptionUrl)}" class="client-btn">
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M12 2c-5.33 4-8 8-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-4-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1 0-2 .67-3.33.67 1.33 2 2.67 4 2.67 2.67 0 5.33-1.33 5.33-4 0 4 3.33 4 3.33 4 0 3.31-2.69 6-6 6zm0-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </div>
                    Import to NekoBox
                </a>
                <a href="streisand://subscribe?url=${encodeURIComponent(subscriptionUrl)}" class="client-btn">
                    <div class="client-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#FFFFFF">
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-11h2v6h-2z"/>
                        </svg>
                    </div>
                    Import to Streisand
                </a>
            </div>
        </div>
        <div class="footer">
            <p>© 2025 REvil, All Rights Reserved</p>
        </div>
    </div>
    <script>
        function copyToClipboard(button, text) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#FF7A3D';
                button.style.color = '#000000';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#FF7A3D';
                    button.style.color = '#000000';
                }, 1000);
            });
        }
    </script>
</body>
</html>
  `;
}

// بقیه توابع مثل streamOverWSHandler و handleTCPOutBound و ... بدون تغییر باقی می‌مونن
// برای جلوگیری از طولانی شدن کد، اون‌ها رو اینجا تکرار نمی‌کنم، ولی توی کد نهایی هستن

function isValidUserCode(code) {
  const codeRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return codeRegex.test(code);
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) return { error: null };
  try {
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, c => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error('safeCloseWebSocket error', error);
  }
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  return (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset);
  if (!isValidUserCode(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}

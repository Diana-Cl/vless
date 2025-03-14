const SUPPORTED_PROTOCOLS = [
  'vmess://',
  'vless://',
  'trojan://',
  'hysteria2://',
  'hy2://',
  'ss://',
];

function isLink(str) {
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ssconf://');
}

function isBase64(str) {
  if (!str || str.length % 4 !== 0) return false;
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str);
}

async function fetchContent(link) {
  if (link.startsWith('ssconf://')) {
    link = link.replace('ssconf://', 'https://');
  }
  try {
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let text = await response.text();
    text = text.trim();
    if (isBase64(text)) {
      try {
        text = atob(text);
      } catch (e) {
        console.error(`Failed to decode Base64 from ${link}:`, e);
      }
    }
    return text;
  } catch (error) {
    console.error(`Failed to fetch ${link}:`, error);
    return null;
  }
}

function extractConfigsFromText(text) {
  const configs = [];
  const protocolPatterns = SUPPORTED_PROTOCOLS.map(protocol => ({
    protocol,
    regex: new RegExp(`(${protocol}[^\\s]+)`, 'g'),
  }));

  for (const { regex } of protocolPatterns) {
    const matches = text.match(regex);
    if (matches) {
      configs.push(...matches);
    }
  }

  return configs;
}

async function extractStandardConfigs(input) {
  const configs = [];
  const lines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  for (const line of lines) {
    if (isLink(line)) {
      const content = await fetchContent(line);
      if (content) {
        const subConfigs = extractConfigsFromText(content);
        configs.push(...subConfigs);
      }
    } else if (isBase64(line)) {
      try {
        const decoded = atob(line);
        const subConfigs = extractConfigsFromText(decoded);
        configs.push(...subConfigs);
        const nestedLines = decoded
          .split('\n')
          .map(line => line.trim())
          .filter(line => line);
        for (const nestedLine of nestedLines) {
          if (isBase64(nestedLine)) {
            try {
              const nestedDecoded = atob(nestedLine);
              const nestedConfigs = extractConfigsFromText(nestedDecoded);
              configs.push(...nestedConfigs);
            } catch (e) {
              console.error('Failed to decode nested Base64:', e);
            }
          }
        }
      } catch (e) {
        console.error('Failed to decode Base64:', e);
      }
    } else {
      const subConfigs = extractConfigsFromText(line);
      configs.push(...subConfigs);
    }
  }

  const allText = input.replace(/\n/g, ' ');
  const subConfigsFromText = extractConfigsFromText(allText);
  configs.push(...subConfigsFromText);

  return [...new Set(configs)];
}

async function convertConfig() {
  const input = document.getElementById('input').value.trim();
  const errorDiv = document.getElementById('error');

  if (!input) {
    errorDiv.textContent = 'Please enter proxy configurations';
    return;
  }

  startLoading();

  try {
    const configs = await extractStandardConfigs(input);
    const outbounds = [];
    const validTags = [];

    for (const config of configs) {
      let converted;
      try {
        if (config.startsWith('vmess://')) {
          converted = convertVmess(config);
        } else if (config.startsWith('vless://')) {
          converted = convertVless(config);
        } else if (config.startsWith('trojan://')) {
          converted = convertTrojan(config);
        } else if (config.startsWith('hysteria2://') || config.startsWith('hy2://')) {
          converted = convertHysteria2(config);
        } else if (config.startsWith('ss://')) {
          converted = convertShadowsocks(config);
        }
      } catch (e) {
        console.error(`Failed to convert config: ${config}`, e);
        continue;
      }

      if (converted) {
        outbounds.push(converted);
        validTags.push(converted.tag);
      }
    }

    if (outbounds.length === 0) {
      throw new Error('No valid configurations found');
    }

    const singboxConfig = createSingboxConfig(outbounds, validTags);
    const jsonString = JSON.stringify(singboxConfig, null, 2);
    editor.setValue(jsonString);
    editor.clearSelection();
    errorDiv.textContent = '';
    document.getElementById('downloadButton').disabled = false;
  } catch (error) {
    errorDiv.textContent = error.message;
    editor.setValue('');
    document.getElementById('downloadButton').disabled = true;
  } finally {
    stopLoading();
  }
}

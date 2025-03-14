const SUPPORTED_PROTOCOLS = ['vmess://', 'vless://', 'trojan://', 'hysteria2://', 'hy2://', 'ss://'];

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
        regex: new RegExp(`(${protocol}[^\\s]+)`, 'g')
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
    const lines = input.split('\n').map(line => line.trim()).filter(line => line);

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
                const nestedLines = decoded.split('\n').map(line => line.trim()).filter(line => line);
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

function createSingboxConfig(outbounds, validTags) {
    return {
        log: {
            level: "error",
            timestamp: true
        },
        dns: {
            servers: [
                {
                    type: "tcp",
                    tag: "proxy-dns",
                    detour: "proxy",
                    domain_resolver: "local-dns",
                    server: "185.228.168.9",
                    server_port: 53
                },
                {
                    type: "tcp",
                    tag: "local-dns",
                    detour: "direct",
                    domain_resolver: "",
                    server: "8.8.4.4",
                    server_port: 53
                },
                {
                    type: "local",
                    tag: "direct-dns",
                    detour: "direct"
                }
            ],
            rules: [
                {
                    rule_set: "geosite-ir",
                    server: "direct-dns"
                },
                {
                    clash_mode: "Direct",
                    server: "direct-dns"
                },
                {
                    source_ip_cidr: ["172.19.0.1/30", "fdfe:dcba:9876::1/126"],
                    server: "proxy-dns"
                },
                {
                    clash_mode: "Global",
                    server: "proxy-dns"
                }
            ],
            final: "proxy-dns",
            strategy: "prefer_ipv4",
            independent_cache: true
        },
        endpoints: [],
        inbounds: [
            {
                type: "tun",
                tag: "tun-in",
                mtu: 9000,
                address: ["172.19.0.1/30", "fdfe:dcba:9876::1/126"],
                auto_route: true,
                exclude_package: ["ir.mci.ecareapp", "com.myirancell"],
                endpoint_independent_nat: true,
                stack: "mixed",
                platform: {
                    http_proxy: {
                        enabled: true,
                        server: "127.0.0.1",
                        server_port: 2080
                    }
                }
            },
            {
                type: "mixed",
                tag: "mixed-in",
                listen: "127.0.0.1",
                listen_port: 2080
            }
        ],
        outbounds: [
            {
                type: "selector",
                tag: "proxy",
                outbounds: ["auto", "direct"].concat(validTags),
                "default": "auto",
                interrupt_exist_connections: true
            },
            {
                type: "urltest",
                tag: "auto",
                outbounds: validTags,
                url: "http://www.gstatic.com/generate_204",
                interval: "10m0s",
                tolerance: 50
            },
            {
                type: "direct",
                tag: "direct",
                domain_strategy: "prefer_ipv4"
            },
            ...outbounds
        ],
        route: {
            rules: [
                {
                    action: "sniff",
                    timeout: "1s"
                },
                {
                    protocol: "dns",
                    action: "hijack-dns"
                },
                {
                    clash_mode: "Direct",
                    outbound: "direct"
                },
                {
                    clash_mode: "Global",
                    outbound: "proxy"
                },
                {
                    rule_set: ["geoip-private", "geosite-private", "geosite-ir", "geoip-ir"],
                    outbound: "direct"
                },
                {
                    rule_set: "geosite-ads",
                    outbound: "block"
                }
            ],
            rule_set: [
                {
                    type: "remote",
                    tag: "geosite-ads",
                    format: "binary",
                    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/category-ads-all.srs",
                    download_detour: "direct"
                },
                {
                    type: "remote",
                    tag: "geosite-private",
                    format: "binary",
                    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/private.srs",
                    download_detour: "direct"
                },
                {
                    type: "remote",
                    tag: "geosite-ir",
                    format: "binary",
                    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/category-ir.srs",
                    download_detour: "direct"
                },
                {
                    type: "remote",
                    tag: "geoip-private",
                    format: "binary",
                    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/private.srs",
                    download_detour: "direct"
                },
                {
                    type: "remote",
                    tag: "geoip-ir",
                    format: "binary",
                    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/ir.srs",
                    download_detour: "direct"
                }
            ],
            final: "proxy",
            override_android_vpn: true,
            auto_detect_interface: true,
            default_domain_resolver: "direct-dns"
        },
        experimental: {
            cache_file: {
                enabled: true
            }
        }
    };
}

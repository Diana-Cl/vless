import re
import os
import time
import base64
import json
import logging
import requests
import urllib.parse
import zlib
from bs4 import BeautifulSoup
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("wireguard_to_neko.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

CHANNEL_URL = "https://t.me/s/freewireguard"
OUTPUT_FILE_WG = 'sub/wireguard5th'
OUTPUT_FILE_NEKO = 'sub/nekobox5th'

def decimal_to_hex(decimal_list):
    try:
        hex_str = ''.join(format(num, '02x') for num in decimal_list)
        logger.info(f"Decimal list converted to hex: {hex_str}")
        return hex_str
    except Exception as e:
        logger.error(f"Error converting decimal to hex: {str(e)}")
        return ""

def hex_to_base64(hex_str):
    try:
        bytes_data = bytes.fromhex(hex_str)
        base64_str = base64.b64encode(bytes_data).decode()
        logger.info(f"Hex converted to base64: {base64_str}")
        return base64_str
    except Exception as e:
        logger.error(f"Error converting hex to base64: {str(e)}")
        return ""

def wireguard_to_neko(wg_url):
    try:
        # Parse WireGuard URL
        parsed = urllib.parse.urlparse(wg_url)
        query = dict(urllib.parse.parse_qs(parsed.query))
        
        private_key = urllib.parse.unquote(parsed.username)

        # Extract reserved parameter and convert to base64
        reserved_decimal = list(map(int, query.get('reserved', [None])[0].split(',')))
        reserved_hex = decimal_to_hex(reserved_decimal)
        reserved_base64 = hex_to_base64(reserved_hex)

        # Build config in specific format that nekobox expects
        config = {
            "type": "wireguard",
            "name": "WireGuard",
            "server": parsed.hostname,
            "port": parsed.port,
            "private_key": private_key,
            "public_key": query['publickey'][0],
            "local_address": [query['address'][0].split(',')[0]],  # Only IPv4
            "peer_endpoint": f"{parsed.hostname}:{parsed.port}",
            "allowed_ips": ["0.0.0.0/0"],
            "mtu": int(query.get('mtu', ['1280'])[0]),
            "dns": ["1.1.1.1", "1.0.0.1"],
            "reserved": reserved_base64
        }

        # Convert to JSON string
        config_json = json.dumps(config)
        logger.info(f"Config JSON: {config_json}")

        # Compress using zlib
        compressed_data = zlib.compress(config_json.encode(), 9)
        logger.info(f"Compressed data length: {len(compressed_data)}")

        # Encode to base64
        encoded = base64.urlsafe_b64encode(compressed_data).decode()
        logger.info(f"Encoded data: {encoded}")

        return f"sn://wg?{encoded}"
    except Exception as e:
        logger.error(f"Error converting to nekobox format: {str(e)}")
        return None

def fetch_wireguard_configs():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(CHANNEL_URL, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        messages = soup.find_all('div', class_='tgme_widget_message_text')

        wg_configs = []
        neko_configs = []

        for message in messages:
            if not message.text:
                continue

            matches = re.finditer(r'wireguard://[^\s]+', message.text)
            for match in matches:
                config = match.group(0)
                base_config = config.split('#')[0]
                wg_configs.append(base_config)

                # Convert to nekobox format
                neko_config = wireguard_to_neko(base_config)
                if neko_config:
                    neko_configs.append(neko_config)

            if len(wg_configs) >= 25:
                break

        wg_configs = wg_configs[:25]
        neko_configs = neko_configs[:25]

        if not wg_configs:
            logger.error("No configs found!")
            return

        # Save WireGuard configs
        final_wg_configs = [
            f"{config}#NiREvil{i+1}"
            for i, config in enumerate(wg_configs)
        ]

        os.makedirs(os.path.dirname(OUTPUT_FILE_WG), exist_ok=True)
        with open(OUTPUT_FILE_WG, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_wg_configs))
        logger.info(f"WireGuard configs saved with {len(wg_configs)} entries")

        # Save Nekobox configs
        final_neko_configs = [
            f"{config}#NiREvil{i+1}"
            for i, config in enumerate(neko_configs)
        ]

        os.makedirs(os.path.dirname(OUTPUT_FILE_NEKO), exist_ok=True)
        with open(OUTPUT_FILE_NEKO, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_neko_configs))
        logger.info(f"Nekobox configs saved with {len(neko_configs)} entries")

        logger.info(f"Execution completed at {datetime.now()}")

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")

if __name__ == '__main__':
    fetch_wireguard_configs()

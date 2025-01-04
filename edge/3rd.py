import re
import os
import time
import base64
import logging
import requests
import urllib.parse
from bs4 import BeautifulSoup
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

CHANNEL_URL = "https://t.me/s/freewireguard"
OUTPUT_FILE_WG = 'sub/wireguardn'
OUTPUT_FILE_NEKO = 'sub/nekobox'

def wireguard_to_neko(wg_url):
    try:
        # Parse WireGuard URL
        parsed = urllib.parse.urlparse(wg_url)
        query = dict(urllib.parse.parse_qs(parsed.query))
        
        # Extract credentials from username part
        private_key = urllib.parse.unquote(parsed.username)
        
        # Build basic WireGuard config
        config = {
            "Interface": {
                "PrivateKey": private_key,
                "Address": query['address'][0].split(',')[0],  # Only take IPv4
                "DNS": "1.1.1.1, 1.0.0.1"
            },
            "Peer": {
                "PublicKey": query['publickey'][0],
                "AllowedIPs": "0.0.0.0/0",
                "Endpoint": f"{parsed.hostname}:{parsed.port}"
            }
        }
        
        # Convert to string format
        config_str = str(config)
        
        # Encode to base64
        encoded = base64.urlsafe_b64encode(config_str.encode()).decode()
        
        # Add nekobox prefix
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
            
        # Save Nekobox configs
        final_neko_configs = [
            f"{config}#NiREvil{i+1}"
            for i, config in enumerate(neko_configs)
        ]
        
        os.makedirs(os.path.dirname(OUTPUT_FILE_NEKO), exist_ok=True)
        with open(OUTPUT_FILE_NEKO, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_neko_configs))
            
        logger.info(f"Successfully SYNCED AT: {datetime.now()}")
        
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")

if __name__ == '__main__':
    fetch_wireguard_configs()

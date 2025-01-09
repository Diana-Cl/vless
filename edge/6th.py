import re
import os
import logging
import requests
import urllib.parse
import zlib
import base64
from bs4 import BeautifulSoup
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

CHANNEL_URL = "https://t.me/s/freewireguard"
OUTPUT_FILE_WG = 'sub/wireguard6th'
OUTPUT_FILE_NEKO = 'sub/nekobox6th'

def wireguard_to_neko(wg_url):
    try:
        parsed = urllib.parse.urlparse(wg_url)
        query = dict(urllib.parse.parse_qs(parsed.query))
        private_key = urllib.parse.unquote(parsed.username)
        
        # Extract and process reserved parameter
        reserved_param = query.get('reserved', [None])[0]
        if reserved_param:
            reserved_decimal = list(map(int, reserved_param.split(',')))
            reserved_bytes = bytes(reserved_decimal)
            reserved_base64 = base64.urlsafe_b64encode(reserved_bytes).decode().rstrip('=')
        else:
            reserved_base64 = ''
        
        # Prepare the byte array mimicking Kryo serialization
        data = bytearray()
        data += (2).to_bytes(4, byteorder='big')  # Version
        
        # localAddress
        local_address = query.get('address', [''])[0].split(',')[0]
        data += len(local_address).to_bytes(4, byteorder='big')
        data += local_address.encode('utf-8')
        
        # privateKey
        data += len(private_key).to_bytes(4, byteorder='big')
        data += private_key.encode('utf-8')
        
        # peerPublicKey
        peer_public_key = query.get('publickey', [''])[0]
        data += len(peer_public_key).to_bytes(4, byteorder='big')
        data += peer_public_key.encode('utf-8')
        
        # peerPreSharedKey (empty)
        data += (0).to_bytes(4, byteorder='big')
        
        # mtu
        mtu_value = int(query.get('mtu', ['1280'])[0])
        data += mtu_value.to_bytes(4, byteorder='big')
        
        # reserved
        data += len(reserved_base64).to_bytes(4, byteorder='big')
        data += reserved_base64.encode('utf-8')
        
        # Compress the data using zlib
        compressed_data = zlib.compress(data)
        
        # Base64 encode without padding
        encoded = base64.urlsafe_b64encode(compressed_data).decode().rstrip('=')
        
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
                
                neko_config = wireguard_to_neko(base_config)
                if neko_config:
                    neko_configs.append(neko_config)
                
                if len(wg_configs) >= 25:
                    break
        
        if not wg_configs:
            logger.error("No configs found!")
            return
        
        # Save WireGuard configs
        final_wg_configs = [f"{config}#NiREvil{i+1}" for i, config in enumerate(wg_configs)]
        os.makedirs(os.path.dirname(OUTPUT_FILE_WG), exist_ok=True)
        with open(OUTPUT_FILE_WG, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_wg_configs))
        
        # Save Nekobox configs
        final_neko_configs = [f"{config}#NiREvil{i+1}" for i, config in enumerate(neko_configs)]
        os.makedirs(os.path.dirname(OUTPUT_FILE_NEKO), exist_ok=True)
        with open(OUTPUT_FILE_NEKO, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_neko_configs))
        
        logger.info(f"Successfully SYNCED AT: {datetime.now()}")
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")

if __name__ == '__main__':
    fetch_wireguard_configs()

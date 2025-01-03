import re
import os
import logging
import requests
import gzip
import base64
from bs4 import BeautifulSoup
from datetime import datetime

# logging 
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# آدرس کانال تلگرام و فایل خروجی
CHANNEL_URL = "https://t.me/s/freewireguard"
OUTPUT_FILE = 'sub/wireguardn'

# تابع تبدیل به فرمت Nekobox
def convert_to_nekobox_format(config_url):
    match = re.match(
        r'^wireguard://(?P<private_key>[^@]+)@(?P<endpoint>[^?]+)\?address=(?P<address>[^&]+)&publickey=(?P<publickey>[^&]+)&mtu=(?P<mtu>\d+)',
        config_url
    )
    if not match:
        return None

    private_key = match.group('private_key')
    endpoint = match.group('endpoint')
    address = match.group('address').replace('%2F', '/').replace('%3A', ':')
    public_key = match.group('publickey')
    mtu = match.group('mtu')

    config = f"""[Interface]
PrivateKey = {private_key}
Address = {address}
MTU = {mtu}

[Peer]
PublicKey = {public_key}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = {endpoint}
"""
    compressed_config = gzip.compress(config.encode('utf-8'))
    encoded_config = base64.urlsafe_b64encode(compressed_config).decode('utf-8')

    return f"sn://wg?{encoded_config}"

def fetch_wireguard_configs():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(CHANNEL_URL, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        messages = soup.find_all('div', class_='tgme_widget_message_text')

        configs = []
        for message in messages:
            if not message.text:
                continue

            matches = re.finditer(r'wireguard://[^\s]+', message.text)
            for match in matches:
                config = match.group(0)
                configs.append(config)

            if len(configs) >= 25:
                break

        configs = configs[:25]

        if not configs:
            logger.error("conf don't exist!")
            return

        final_configs = []
        for i, config in enumerate(configs):
            converted_config = convert_to_nekobox_format(config)
            if converted_config:
                final_configs.append(f"{converted_config}#NiREvil{i+1}")

        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(final_configs))

        logger.info(f"synced successfully: {datetime.now()}")

    except Exception as e:
        logger.error(f"shiiiit: {str(e)}")


if __name__ == '__main__':
    fetch_wireguard_configs()

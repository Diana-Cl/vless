import re
import os
import logging
import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
CHANNEL_URL = "https://t.me/s/Diwire"
OUTPUT_DIR = 'sub'
OUTPUT_FILES = {
    'neko': 'nekobox-wg.json',
    'husi': 'husi-wg.json',
    'exclave': 'exclave-wg.json'
}
def read_existing_configs(file_path):
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return set(f.read().strip().split('\n\n'))
        return set()
    except Exception as e:
        logger.error(f"Error reading existing configs: {str(e)}")
        return set()
def fetch_configs():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(CHANNEL_URL, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        messages = soup.find_all('div', class_='tgme_widget_message_text')

        # Read existing configs
        existing_configs = {
            config_type: read_existing_configs(os.path.join(OUTPUT_DIR, filename))
            for config_type, filename in OUTPUT_FILES.items()
        }

        # Initialize new configs dict
        new_configs = {
            'neko': set(),
            'husi': set(),
            'exclave': set()
        }

        for message in messages:
            if not message.text:
                continue

            # Find all configs using different patterns
            patterns = {
                'neko': r'sn://[^\s]+',
                'husi': r'husi://[^\s]+',
                'exclave': r'exclave://[^\s]+'
            }

            for config_type, pattern in patterns.items():
                matches = re.finditer(pattern, message.text)
                for match in matches:
                    config = match.group(0)
                    if config not in existing_configs[config_type]:
                        new_configs[config_type].add(config)

        if all(len(cfg_set) == 0 for cfg_set in new_configs.values()):
            logger.info("No new configs found!")
            return

        # Create output directory if it doesn't exist
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Append new configs to existing files
        for config_type, config_set in new_configs.items():
            if config_set:
                output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILES[config_type])

                # Combine existing and new configs
                all_configs = existing_configs[config_type].union(config_set)

                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write('\n\n'.join(sorted(all_configs)))

                logger.info(f"Added {len(config_set)} new {config_type} configs")

        logger.info(f"synced at: {datetime.now()}")

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
if __name__ == '__main__':
    fetch_configs()

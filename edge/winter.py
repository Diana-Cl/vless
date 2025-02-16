import json
import random
import requests
import os
from datetime import datetime

def fetch_ips():
    try:
        response = requests.get('https://raw.githubusercontent.com/ircfspace/endpoint/refs/heads/main/ip.json')
        data = response.json()
        return data
    except Exception as e:
        return {
            "ipv4": ["162.159.192.23:859", "162.159.192.178:4500"],
            "ipv6": ["[2606:4700:d1::9f62:b405:88e4:858e]:7152"]
        }

def generate_config(ip_port, index, ip_version):
    base = f"warp://{ip_port}/?ifp=50-100&ifps=50-100&ifpd=3-6&ifpm=m4&&detour=warp://{ip_port}/?ifp=50-100&ifps=50-100&ifpd=3-6&ifpm=m4#WoW-{ip_version}🇩🇪-{index}"
    return base

def update_config_file():
    with open('edge/assets/wow-template.json', 'r', encoding='utf-8') as f:
        template = f.read()

    ips = fetch_ips()
    
    ipv4_list = random.sample(ips['ipv4'], 2)
    ipv6 = random.choice(ips['ipv6'])
    
    configs = []
    configs.append(generate_config(ipv4_list[0], 1, "IPv4"))
    configs.append(generate_config(ipv4_list[1], 2, "IPv4"))
    configs.append(generate_config(ipv6, 3, "IPv6"))
    
    final_config = template + "\n" + "\n\n".join(configs)
    
    with open('hiddify/wow.txt', 'w', encoding='utf-8') as f:
        f.write(final_config)

if __name__ == "__main__":
    update_config_file()

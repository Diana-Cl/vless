import ipaddress
import platform
import subprocess
import os
import datetime
import base64
import json
warp_cidr = [
    "162.159.192.0/24",
    "162.159.193.0/24",
    "162.159.195.0/24",
    "162.159.204.0/24",
    "188.114.96.0/24",
    "188.114.97.0/24",
    "188.114.98.0/24",
    "188.114.99.0/24",
]
# تنظیم مسیرهای اصلی
script_directory = os.path.dirname(__file__)
main_directory = os.path.dirname(script_directory)
edge_directory = os.path.join(main_directory, "edge")
# ایجاد فولدر edge اگر وجود نداشت
if not os.path.exists(edge_directory):
    os.makedirs(edge_directory)
# مسیر فایل‌ها
Bestip_path = os.path.join(edge_directory, "Bestip.txt")
endpoints_path_edge = os.path.join(edge_directory, "endpoints.csv")
endpoints_path_main = os.path.join(main_directory, "endpoints.csv")
singbox_path = os.path.join(main_directory, "sing-box.json")
warp_path = os.path.join(main_directory, "warp.json")
def create_ips():
    c = 0
    top_ips = sum(len(list(ipaddress.IPv4Network(cidr))) for cidr in warp_cidr)
    with open(Bestip_path, "w") as file:
        for cidr in warp_cidr:
            ip_addresses = list(ipaddress.IPv4Network(cidr))
            for addr in ip_addresses:
                c += 1
                file.write(str(addr))
                if c != top_ips:
                    file.write("\n")
# بررسی وجود فایل Bestip.txt
if os.path.exists(Bestip_path):
    print("Bestip.txt exists.")
else:
    print("Creating Bestip.txt File.")
    create_ips()
    print("Bestip.txt File Created Successfully!")

def main(edge_dir, main_dir):
    try:
        arch = arch_suffix()
        print("Fetch warp program...")
        url = f"https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/warp-linux-{arch}"
        warp_executable = os.path.join(edge_dir, "warp")
        subprocess.run(["wget", url, "-O", warp_executable], check=True)
        os.chmod(warp_executable, 0o755)
        print("Scanning IPs...")
        subprocess.run(
            [warp_executable], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        print("Warp executed successfully.")
        # کپی فایل endpoints.csv از edge به main
        if os.path.exists(endpoints_path_edge):
            with open(endpoints_path_edge, 'r') as src, open(endpoints_path_main, 'w') as dst:
                dst.write(src.read())
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if os.path.exists(warp_executable):
            os.remove(warp_executable)
        top_ips = []
        with open(endpoints_path_edge, "r") as csv_file:
            next(csv_file)
            for _ in range(2):
                line = next(csv_file, None)
                if line:
                    top_ips.append(line.split(",")[0])
        # ایجاد فایل‌های json در مسیر اصلی
        export_Hiddify(top_ips)
        export_SingBox(top_ips)
if __name__ == "__main__":
    script_directory = os.path.dirname(__file__)
    main_directory = os.path.dirname(script_directory)
    edge_directory = os.path.join(main_directory, "edge")
    main(edge_directory, main_directory)

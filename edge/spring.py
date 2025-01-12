import ipaddress
import platform
import subprocess
import os
import datetime
import base64
import json

# تنظیم مسیرهای جدید
script_directory = os.path.dirname(__file__)
edge_directory = os.path.join(script_directory, "edge")
os.makedirs(edge_directory, exist_ok=True)

# مسیر فایل‌ها
Bestip_path = os.path.join(edge_directory, "Bestip.txt")
result_path_edge = os.path.join(edge_directory, "result.csv")
result_path_main = os.path.join(script_directory, "result.csv")
warp_json_path = os.path.join(script_directory, "warp.json")
sing_box_json_path = os.path.join(script_directory, "sing-box.json")

# ساخت لیست IP
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

if not os.path.exists(Bestip_path):
    print("Creating Bestip.txt File...")
    create_ips()
    print("Bestip.txt File Created Successfully!")

# دانلود و اجرای warp
def fetch_and_run_warp():
    arch = arch_suffix()
    warp_url = f"https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/warp-linux-{arch}"
    warp_path = os.path.join(edge_directory, "warp")
    subprocess.run(["wget", warp_url, "-O", warp_path], check=True)
    os.chmod(warp_path, 0o755)
    subprocess.run([warp_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(warp_path)

# به‌روزرسانی فایل‌ها
def update_result_files():
    with open(result_path_edge, "r") as csv_file:
        next(csv_file)
        lines = csv_file.readlines()
    with open(result_path_edge, "w") as f_edge, open(result_path_main, "w") as f_main:
        for line in lines:
            f_edge.write(line)
            f_main.write(line)

# ساخت فایل‌های warp.json و sing-box.json
def create_warp_json(Bestip):
    formatted_time = datetime.datetime.now().strftime("%A, %d %b %Y, %H:%M")
    title = "//profile-title: base64:" + base64.b64encode("Freedom to Dream 💛✨".encode("utf-8")).decode("utf-8") + "\n"
    update_interval = "//profile-update-interval: 4\n"
    sub_info = "//subscription-userinfo: upload=805306368000; download=2576980377600; total=6012954214400; expire=1762677732\n"
    profile_web = "//profile-web-page-url: https://github.com/NiREvil\n"
    last_modified = "//last update on: " + formatted_time + "\n"
    config_prefix = f"warp://{Bestip[0]}#Tehran&&warp://{Bestip[1]}#Berlin"
    with open(warp_json_path, "w") as op:
        op.write(title + update_interval + sub_info + profile_web + last_modified + config_prefix)

def main():
    fetch_and_run_warp()
    update_result_files()
    with open(result_path_edge, "r") as csv_file:
        next(csv_file)
        Bestip = [line.split(",")[0] for line in csv_file.readlines()[:2]]
    create_warp_json(Bestip)
    print("All tasks completed successfully!")

if __name__ == "__main__":
    main()

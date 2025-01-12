import ipaddress
import platform
import subprocess
import os
import datetime
import base64
import json

# تعریف متغیر warp_cidr
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

# مسیر فولدر edge
script_directory = os.path.dirname(__file__)
edge_directory = os.path.join(script_directory, "edge")
os.makedirs(edge_directory, exist_ok=True)

# مسیر فایل‌ها
Bestip_path = os.path.join(edge_directory, "Bestip.txt")
result_path = os.path.join(edge_directory, "result.csv")

# تابع برای ایجاد IP‌ها
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

# تعیین نوع معماری سیستم
def arch_suffix():
    machine = platform.machine().lower()
    if machine.startswith("i386") or machine.startswith("i686"):
        return "386"
    elif machine.startswith(("x86_64", "amd64")):
        return "amd64"
    elif machine.startswith(("armv8", "arm64", "aarch64")):
        return "arm64"
    elif machine.startswith("s390x"):
        return "s390x"
    else:
        raise ValueError("Unsupported CPU architecture")

# دانلود برنامه warp و اسکن IP‌ها
arch = arch_suffix()
print("Fetching warp program...")
url = f"https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/warp-linux-{arch}"
subprocess.run(["wget", url, "-O", "warp"])
os.chmod("warp", 0o755)

# اجرای دستور warp
command = "./warp >/dev/null 2>&1"
print("Scanning IPs...")
process = subprocess.Popen(command, shell=True)
process.wait()
if process.returncode != 0:
    print("Error: Warp execution failed.")
else:
    print("Warp executed successfully.")

# پردازش فایل result.csv
Bestip = []
if os.path.exists(result_path):
    with open(result_path, "r") as csv_file:
        next(csv_file)  # رد کردن هدر CSV
        c = 0
        for line in csv_file:
            Bestip.append(line.split(",")[0])
            c += 1
            if c == 2:
                break

# به‌روزرسانی فایل Bestip.txt
with open(Bestip_path, "w") as f:
    for ip in Bestip:
        f.write(f"{ip}\n")

formatted_time = datetime.datetime.now().strftime("%A, %d %b %Y, %H:%M")

# خروجی به فرمت JSON
def export_Hiddify(t_ips):
    config_prefix = (
        f"warp://{t_ips[0]}?ifp=1-3&ifpm=m4#⚪️Tehran&&detour=warp://{t_ips[1]}?ifp=1-2&ifpm=m5#🟡Berlin"
    )
    return config_prefix, formatted_time

title = (
    "//profile-title: base64:"
    + base64.b64encode("Freedom to Dream 💛✨".encode("utf-8")).decode("utf-8")
    + "\n"
)
update_interval = "//profile-update-interval: 4\n"
sub_info = "//subscription-userinfo: upload=805306368000; download=2576980377600; total=6012954214400; expire=1762677732\n"
profile_web = "//profile-web-page-url: https://github.com/NiREvil\n"
last_modified = "//last update on: " + formatted_time + "\n"
config_prefix, _ = export_Hiddify(Bestip)

with open(os.path.join(script_directory, "warp.json"), "w") as op:
    op.write(
        title + update_interval + sub_info + profile_web + last_modified + config_prefix
    )

# پاک‌سازی فایل‌ها
os.remove(Bestip_path)
os.remove("warp")

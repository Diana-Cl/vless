import ipaddress
import platform
import subprocess
import os
import datetime
import base64
import json

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

script_directory = os.path.dirname(__file__)
main_directory = os.path.dirname(script_directory)
edge_directory = os.path.join(main_directory, "edge")

if not os.path.exists(edge_directory):
   os.makedirs(edge_directory)

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

if os.path.exists(Bestip_path):
   print("Bestip.txt exists.")
else:
   print("Creating Bestip.txt File.")
   create_ips()
   print("Bestip.txt File Created Successfully!")

def toSingBox(tag, clean_ip, detour):
   print("Generating Warp Conf")
   command = 'wget -N "https://gitlab.com/fscarmen/warp/-/raw/main/api.sh" && sudo bash api.sh -r'
   prc = subprocess.run(command, capture_output=True, text=True, shell=True)
   output = prc.stdout

   if (prc.returncode == 0) and output:
       try:
           data = json.loads(output)
           wg = {
               "tag": f"{tag}",
               "type": "wireguard",
               "server": f"{clean_ip.split(':')[0]}",
               "server_port": int(clean_ip.split(":")[1]),
               "local_address": [
                   "172.16.0.2/32",
                   "2606:4700:110:8735:bb29:91bc:1c82:aa73/128",
               ],
               "private_key": f"{data['private_key']}",
               "peer_public_key": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
               "mtu": 1300,
               "reserved": data["config"]["reserved"],
               "detour": f"{detour}",
               "workers": 2,
           }

           for file in ["api.sh"]:
               if os.path.exists(file):
                   os.remove(file)
                   print(f"Removed {file}")
               else:
                   print(f"{file} not found, skipping removal")

           return wg
       except json.JSONDecodeError:
           print("Error: Unable to parse JSON output") 
           return None
       except KeyError as e:
           print(f"Error: Missing key in JSON data: {e}")
           return None
   else:
       print("Error: Command execution failed or produced no output")
       return None

def export_SingBox(t_ips):
   with open("edge/assets/singbox-template.json", "r") as f:
       data = json.load(f)

   data["outbounds"][1]["outbounds"].extend(["⚪️Tehran", "🟡Berlin"])

   tehran_wg = toSingBox("⚪️Tehran", t_ips[0], "direct")
   if tehran_wg:
       data["outbounds"].insert(2, tehran_wg)
   else:
       print("Failed to generate ⚪️Tehran configuration")

   berlin_wg = toSingBox("🟡Berlin", t_ips[1], "⚪️Tehran")
   if berlin_wg:
       data["outbounds"].insert(3, berlin_wg)
   else:
       print("Failed to generate 🟡Berlin configuration")

   with open(singbox_path, "w") as f:
       json.dump(data, f, indent=4)

def export_Hiddify(t_ips):
   formatted_time = datetime.datetime.now().strftime("%A, %d %b %Y, %H:%M")
   config_prefix = f"warp://{t_ips[0]}?ifp=1-3&ifpm=m4#⚪️Tehran&&detour=warp://{t_ips[1]}?ifp=1-2&ifpm=m5#🟡Berlin"
   
   title = "//profile-title: base64:" + base64.b64encode("Freedom to Dream 💛✨".encode("utf-8")).decode("utf-8") + "\n"
   update_interval = "//profile-update-interval: 4\n"
   sub_info = "//subscription-userinfo: upload=805306368000; download=2576980377600; total=6012954214400; expire=1762677732\n"
   profile_web = "//profile-web-page-url: https://github.com/NiREvil\n"
   last_modified = "//last update on: " + formatted_time + "\n"

   with open(warp_path, "w") as op:
       op.write(title + update_interval + sub_info + profile_web + last_modified + config_prefix)

def main(edge_dir, main_dir):
   try:
       arch = arch_suffix()
       print("Fetch warp program...")
       url = f"https://gitlab.com/Misaka-blog/warp-script/-/raw/main/files/warp-yxip/warp-linux-{arch}"
       warp_executable = os.path.join(edge_dir, "warp")
       subprocess.run(["wget", url, "-O", warp_executable], check=True)
       os.chmod(warp_executable, 0o755)
       print("Scanning IPs...")
       subprocess.run([warp_executable], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
       print("Warp executed successfully.")

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

       export_Hiddify(top_ips)
       export_SingBox(top_ips)

if __name__ == "__main__":
   script_directory = os.path.dirname(__file__)
   main_directory = os.path.dirname(script_directory)
   edge_directory = os.path.join(main_directory, "edge")
   main(edge_directory, main_directory)

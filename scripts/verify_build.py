import os
import shutil
import subprocess
import sys

root = r"c:\Users\JR SAILESH IYYAPPAN\OneDrive\Desktop\PORTFOLIO\project"
player_path = os.path.join(root, "src", "components", "ui", "VideoPlayer.tsx")
video_dir = os.path.join(root, "public", "videos")

if os.path.isfile(player_path):
    os.remove(player_path)
if os.path.isdir(video_dir):
    shutil.rmtree(video_dir)

result = subprocess.run(["npm", "run", "build"], cwd=root, capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
sys.exit(result.returncode)

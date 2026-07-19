import subprocess
import sys

root = r"c:\Users\JR SAILESH IYYAPPAN\OneDrive\Desktop\PORTFOLIO\project"
res = subprocess.run(["npm.cmd", "run", "build"], cwd=root, capture_output=True, text=True)
print(res.stdout)
print(res.stderr)
sys.exit(res.returncode)

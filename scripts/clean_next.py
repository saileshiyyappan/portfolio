import shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
next_dir = root / '.next'
print('next_exists', next_dir.exists())
if next_dir.exists():
    try:
        shutil.rmtree(next_dir)
        print('next_removed', not next_dir.exists())
    except Exception as e:
        print('remove_error', type(e).__name__, e)

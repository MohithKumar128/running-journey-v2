import subprocess
import shutil
import sys
import fcntl
from pathlib import Path

# Prevent concurrent updates using file locking
lock_file = open("update.lock", "w")
try:
    fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    print("Another update process is already running. Exiting.")
    sys.exit(0)

backend_dir = Path(__file__).parent

print("Step 1: Downloading activities...")
subprocess.run([sys.executable, "download_activities.py"], cwd=str(backend_dir), check=True)

print("Step 2: Converting JSON to CSV...")
subprocess.run([sys.executable, "json_to_csv.py"], cwd=str(backend_dir), check=True)

print("Step 3: Running analytics...")
subprocess.run([sys.executable, "analyze.py"], cwd=str(backend_dir), check=True)

print("Update complete!")

# Copy analytics.json to the React dashboard if the target directory exists
for dest_path in [
    "/home/mohith/strava-dashboard/src/data/analytics.json",
    "/home/mohith/Running-Journey/frontend/src/data/analytics.json"
]:
    try:
        if Path(dest_path).parent.exists():
            shutil.copy("analytics.json", dest_path)
            print(f"✅ analytics.json copied to dashboard at {dest_path}")
    except Exception as e:
        print(f"Could not copy to {dest_path}: {e}")


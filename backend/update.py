import subprocess
import shutil

print("Step 1: Downloading activities...")
subprocess.run(["python3", "download_activities.py"])

print("Step 2: Converting JSON to CSV...")
subprocess.run(["python3", "json_to_csv.py"])

print("Step 3: Running analytics...")
subprocess.run(["python3", "analyze.py"])

print("Update complete!")
# Copy analytics.json to the React dashboard
shutil.copy(
    "analytics.json",
    "/home/mohith/strava-dashboard/src/data/analytics.json"
)

print("✅ analytics.json copied to dashboard!")

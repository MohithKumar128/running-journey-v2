import json
import csv

with open("activities.json", "r") as f:
    
    activities = json.load(f)

with open("activities.csv", "w", newline="") as f:
    writer = csv.writer(f)

    writer.writerow([
        "id",
        "name",
        "sport_type",
        "distance_km",
        "moving_time_min",
        "elevation_gain",
        "start_date"
    ])

    for activity in activities:
        writer.writerow([
            activity.get("id"),
            activity.get("name"),
            activity.get("sport_type"),
            round(activity.get("distance", 0) / 1000, 2),
            round(activity.get("moving_time", 0) / 60, 2),
            activity.get("total_elevation_gain"),
            activity.get("start_date_local")
        ])

print("Saved activities.csv")

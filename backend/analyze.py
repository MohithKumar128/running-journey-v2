"""
analyze.py

Strava activities analytics processing script.
Reads activity data from activities.csv, calculates metrics, records, 
and distance breakdowns (monthly & weekly), and exports them to analytics.json.
"""

import csv
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

# File paths
INPUT_FILE = "activities.csv"
OUTPUT_FILE = "analytics.json"

# Sport types mapping for summary keys
SPORT_KEYS = {
    "Run": "running",
    "Ride": "cycling",
    "Walk": "walking",
    "Hike": "hiking",
    "TrailRun": "trailRunning"
}

def to_float(val: Any, default: float = 0.0) -> float:
    """
    Safely converts a value to float, defaulting to the specified value on failure.
    """
    if val is None:
        return default
    val_str = str(val).strip()
    if not val_str:
        return default
    try:
        return float(val_str)
    except ValueError:
        return default

def to_int(val: Any, default: Optional[int] = None) -> Optional[int]:
    """
    Safely converts a value to int, defaulting to the specified value on failure.
    """
    if val is None:
        return default
    val_str = str(val).strip()
    if not val_str:
        return default
    try:
        return int(val_str)
    except ValueError:
        return default

def parse_activities(file_path: str) -> List[Dict[str, Any]]:
    """
    Reads activities from the CSV file and parses the fields into correct types.
    """
    activities = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Handle conversion of ID, distance, time, and elevation
                act_id = to_int(row.get("id"))
                distance = to_float(row.get("distance_km"))
                moving_time = to_float(row.get("moving_time_min"))
                elevation = to_float(row.get("elevation_gain"))

                activity = {
                    "id": act_id,
                    "name": row.get("name", "").strip(),
                    "sport_type": row.get("sport_type", "").strip(),
                    "distance_km": distance,
                    "moving_time_min": moving_time,
                    "elevation_gain": elevation,
                    "start_date": row.get("start_date", "").strip()
                }
                activities.append(activity)
    except FileNotFoundError:
        print(f"Error: Source file '{file_path}' not found.")
    return activities

def calculate_summary(activities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates summary metrics across all activities.
    """
    summary = {
        "totalActivities": len(activities),
        "runningActivities": 0,
        "cyclingActivities": 0,
        "walkingActivities": 0,
        "hikingActivities": 0,
        "trailRunningActivities": 0,
        "totalDistance": 0.0,
        "runningDistance": 0.0,
        "cyclingDistance": 0.0,
        "walkingDistance": 0.0,
        "hikingDistance": 0.0,
        "trailRunningDistance": 0.0,
        "totalTime": 0.0,
        "averagePace": 0.0,
        "totalElevation": 0.0
    }

    # Sum distance, time, elevation, and count sport types
    for act in activities:
        dist = act["distance_km"]
        time_min = act["moving_time_min"]
        elev = act["elevation_gain"]
        sport = act["sport_type"]

        summary["totalDistance"] += dist
        summary["totalTime"] += time_min
        summary["totalElevation"] += elev

        sport_key = SPORT_KEYS.get(sport)
        if sport_key:
            summary[f"{sport_key}Activities"] += 1
            summary[f"{sport_key}Distance"] += dist

    # Calculate average pace for Run activities (total run time / total run distance)
    run_activities = [a for a in activities if a["sport_type"] == "Run"]
    total_run_dist = sum(r["distance_km"] for r in run_activities)
    total_run_time = sum(r["moving_time_min"] for r in run_activities)

    if total_run_dist > 0:
        summary["averagePace"] = round(total_run_time / total_run_dist, 2)
    else:
        summary["averagePace"] = 0.0

    # Round all float summary metrics to 2 decimal places
    summary["totalDistance"] = round(summary["totalDistance"], 2)
    summary["totalTime"] = round(summary["totalTime"], 2)
    summary["totalElevation"] = round(summary["totalElevation"], 2)

    for sport_key in SPORT_KEYS.values():
        dist_key = f"{sport_key}Distance"
        summary[dist_key] = round(summary[dist_key], 2)

    return summary

def format_record(act: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Helper to format an activity record for JSON export.
    """
    if not act:
        return {}
    
    record = {
        "id": act["id"],
        "name": act["name"],
        "sport_type": act["sport_type"],
        "distance_km": round(act["distance_km"], 2),
        "moving_time_min": round(act["moving_time_min"], 2),
        "elevation_gain": round(act["elevation_gain"], 2),
        "start_date": act["start_date"]
    }
    
    # Calculate and attach pace for running record representation
    if act["distance_km"] > 0:
        record["pace"] = round(act["moving_time_min"] / act["distance_km"], 2)
        
    return record

def calculate_records(activities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Identifies records (longest run, fastest run, highest elevation run) among Run activities.
    """
    run_activities = [a for a in activities if a["sport_type"] == "Run"]
    
    longest_run = None
    fastest_run = None
    highest_elevation_run = None

    if run_activities:
        # Longest Run (max distance_km)
        longest_run = max(run_activities, key=lambda a: a["distance_km"])

        # Fastest Run (min pace: moving_time_min / distance_km where distance > 0)
        runs_with_dist = [r for r in run_activities if r["distance_km"] > 0]
        if runs_with_dist:
            fastest_run = min(runs_with_dist, key=lambda a: a["moving_time_min"] / a["distance_km"])

        # Highest Elevation Run (max elevation_gain)
        highest_elevation_run = max(run_activities, key=lambda a: a["elevation_gain"])

    return {
        "longestRun": format_record(longest_run),
        "fastestRun": format_record(fastest_run),
        "highestElevationRun": format_record(highest_elevation_run)
    }

def calculate_monthly_distance(activities: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates total distance by month (grouped by YYYY-MM) and returns sorted results.
    """
    monthly = {}
    for act in activities:
        start_date = act.get("start_date")
        if start_date:
            try:
                # Expecting ISO date string: YYYY-MM-DDTHH:MM:SSZ
                month_key = start_date[:7]  # YYYY-MM
                if len(month_key) == 7 and month_key[4] == '-':
                    monthly[month_key] = monthly.get(month_key, 0.0) + act["distance_km"]
            except Exception:
                continue
                
    # Sort chronologically and round distances
    return {k: round(v, 2) for k, v in sorted(monthly.items())}

def calculate_weekly_distance(activities: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates total distance by ISO week (grouped by YYYY-Www) and returns sorted results.
    """
    weekly = {}
    for act in activities:
        start_date = act.get("start_date")
        if start_date:
            try:
                # Parse date part (YYYY-MM-DD)
                date_str = start_date[:10]
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                year, week, _ = dt.isocalendar()
                week_key = f"{year}-W{week:02d}"
                weekly[week_key] = weekly.get(week_key, 0.0) + act["distance_km"]
            except Exception:
                continue
                
    # Sort chronologically and round distances
    return {k: round(v, 2) for k, v in sorted(weekly.items())}

def print_console_summary(summary: Dict[str, Any], records: Dict[str, Any]) -> None:
    """
    Prints a beautiful summary of activities to the console.
    """
    print("\n========================================")
    print("📊 STRAVA ANALYTICS SUMMARY")
    print("========================================")
    print(f"Total Activities: {summary['totalActivities']}")
    print(f"Total Distance:   {summary['totalDistance']} km")
    print(f"Total Time:       {summary['totalTime']} min")
    print(f"Total Elevation:  {summary['totalElevation']} m")
    
    print("\n🏃 Running Statistics")
    print(f"  Activities:     {summary['runningActivities']}")
    print(f"  Total Distance: {summary['runningDistance']} km")
    print(f"  Average Pace:   {summary['averagePace']} min/km")
    
    if records["longestRun"]:
        print(f"  Longest Run:    {records['longestRun']['distance_km']} km ({records['longestRun']['name']})")
    if records["fastestRun"]:
        print(f"  Fastest Pace:   {records['fastestRun']['pace']} min/km ({records['fastestRun']['name']})")
    if records["highestElevationRun"]:
        print(f"  Max Elevation:  {records['highestElevationRun']['elevation_gain']} m ({records['highestElevationRun']['name']})")

    print("\n🚴 Cycling Statistics")
    print(f"  Activities:     {summary['cyclingActivities']}")
    print(f"  Total Distance: {summary['cyclingDistance']} km")

    print("\n🚶 Walking Statistics")
    print(f"  Activities:     {summary['walkingActivities']}")
    print(f"  Total Distance: {summary['walkingDistance']} km")
    
    print("\n🥾 Hiking Statistics")
    print(f"  Activities:     {summary['hikingActivities']}")
    print(f"  Total Distance: {summary['hikingDistance']} km")

    print("\n🏔 Trail Running Statistics")
    print(f"  Activities:     {summary['trailRunningActivities']}")
    print(f"  Total Distance: {summary['trailRunningDistance']} km")
    print("========================================\n")

def main():
    print(f"Reading activities from {INPUT_FILE}...")
    activities = parse_activities(INPUT_FILE)
    
    if not activities:
        print("No activities loaded. Exiting.")
        return

    # Calculate metrics
    summary = calculate_summary(activities)
    records = calculate_records(activities)
    monthly_dist = calculate_monthly_distance(activities)
    weekly_dist = calculate_weekly_distance(activities)

    # Format activities for serialization
    formatted_activities = []
    for act in activities:
        formatted_activities.append({
            "id": act["id"],
            "name": act["name"],
            "sport_type": act["sport_type"],
            "distance_km": round(act["distance_km"], 2),
            "moving_time_min": round(act["moving_time_min"], 2),
            "elevation_gain": round(act["elevation_gain"], 2),
            "start_date": act["start_date"]
        })

    # Prepare final output structure
    output_data = {
        "summary": summary,
        "records": records,
        "monthlyDistance": monthly_dist,
        "weeklyDistance": weekly_dist,
        "activities": formatted_activities
    }

    # Save to analytics.json
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Success: Saved analytics report to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error saving analytics to {OUTPUT_FILE}: {e}")

    # Display console report
    print_console_summary(summary, records)

if __name__ == "__main__":
    main()

import os
import json
import requests
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")

# Get fresh access token
response = requests.post(
    "https://www.strava.com/oauth/token",
    data={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
        "grant_type": "refresh_token"
    }
)

token_data = response.json()

# Debug: if Strava returns an error, print it and stop
if "access_token" not in token_data:
    print("ERROR FROM STRAVA:")
    print(token_data)
    exit()

access_token = token_data["access_token"]
print("Access token obtained")
# Download activities
activities = requests.get(
    "https://www.strava.com/api/v3/athlete/activities",
    headers={
        "Authorization": f"Bearer {access_token}"
    },
    params={
        "per_page": 200
    }
)

activities_data = activities.json()

print("Activities downloaded!")

with open("activities.json", "w") as f:
    json.dump(activities_data, f, indent=2)

print("Saved activities.json")

from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import json
from pathlib import Path
import traceback
import os

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return {"message": "Strava Backend Running"}


@app.route("/refresh", methods=["POST"])
def refresh():
    result = subprocess.run(
        ["python3", "update.py"],
        capture_output=True,
        text=True
    )

    return jsonify({
        "success": result.returncode == 0,
        "output": result.stdout,
        "error": result.stderr
    })


@app.route("/stats")
def stats():
    try:
        path = Path(__file__).parent / "analytics.json"

        with open(path, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))

    except Exception as e:
        return jsonify({
            "error": str(e),
            "trace": traceback.format_exc()
        }), 500


@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    # Strava verification request
    if request.method == "GET":
        return {
            "hub.challenge": request.args.get("hub.challenge")
        }

    # Webhook event
    event = request.json

    print("=" * 50)
    print("WEBHOOK RECEIVED")
    print(event)
    print("=" * 50)

    # Only process new activities
    if (
        event.get("object_type") == "activity"
        and event.get("aspect_type") == "create"
    ):
        print("New activity detected. Running update.py...")

        result = subprocess.run(
            ["python3", "update.py"],
            capture_output=True,
            text=True
        )

        print(result.stdout)

        if result.stderr:
            print(result.stderr)

    return "", 200


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )

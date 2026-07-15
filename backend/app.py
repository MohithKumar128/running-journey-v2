from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import json

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
    with open("analytics.json", "r") as f:
        return jsonify(json.load(f))


if __name__ == "__main__":
    import os
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )
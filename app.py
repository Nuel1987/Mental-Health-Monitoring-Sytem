from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory database for resources
RESOURCES = [
    {
        "title": "Mindfulness Meditation Guide",
        "description": "Learn mindfulness techniques to improve mental health.",
        "link": "https://www.mindful.org/meditation/mindfulness-getting-started/"
    },
    {
        "title": "Crisis Support Hotline",
        "description": "24/7 support for those experiencing a mental health crisis.",
        "link": "https://www.crisistextline.org/"
    },
    {
        "title": "Cognitive Behavioral Therapy Basics",
        "description": "An introduction to CBT techniques for managing anxiety and depression.",
        "link": "https://www.psychologytoday.com/gb/basics/cognitive-behavioral-therapy"
    }
]

# Homepage route
@app.route('/')
def home():
    return render_template('index.html')  # Ensure your index.html file is in the templates folder

# Endpoint for mental health assessment
@app.route('/api/assessment', methods=['POST'])
def handle_assessment():
    try:
        data = request.json  # Get JSON data from the request
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Example: Simple logic to evaluate mental health based on input
        stress_level = int(data.get("stress_level", 0))
        sleep_quality = int(data.get("sleep_quality", 0))
        mood = data.get("mood", "").lower()

        if stress_level > 7 or sleep_quality < 4 or mood == "bad":
            message = "It seems you might be experiencing some difficulties. Consider seeking professional advice."
        else:
            message = "You seem to be managing well. Keep up the good work!"

        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint to get mental health resources
@app.route('/api/resources', methods=['GET'])
def get_resources():
    try:
        return jsonify(RESOURCES), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from google.cloud import dialogflow_v2 as dialogflow
import os

app = Flask(__name__)
CORS(app)

# Dialogflow project configuration
PROJECT_ID = 'your-dialogflow-project-id'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/your/service-account-file.json'

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
    return render_template('index.html')

# Endpoint for mental health assessment
@app.route('/api/assessment', methods=['POST'])
def handle_assessment():
    data = request.json
    stress_level = int(data.get('stress_level', 0))
    sleep_quality = int(data.get('sleep_quality', 0))
    mood = data.get('mood', '').lower()

    if stress_level > 7 or sleep_quality < 4 or mood == 'bad':
        message = "It seems you might be experiencing some difficulties. Consider seeking professional advice."
    else:
        message = "You seem to be managing well. Keep up the good work!"
    return jsonify({"message": message}), 200

# Endpoint to get mental health resources
@app.route('/api/resources', methods=['GET'])
def get_resources():
    return jsonify(RESOURCES), 200

# Endpoint to handle chatbot interaction
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')

        # Dialogflow session setup
        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(PROJECT_ID, "unique-session-id")

        text_input = dialogflow.TextInput(text=user_message, language_code='en')
        query_input = dialogflow.QueryInput(text=text_input)
        response = session_client.detect_intent(session=session, query_input=query_input)

        return jsonify({"response": response.query_result.fulfillment_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

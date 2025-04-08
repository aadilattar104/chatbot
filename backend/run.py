# run.py

from flask import Flask, request, jsonify
from chatbot import ask_gemini
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    response = ask_gemini(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)

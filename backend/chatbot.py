# chatbot.py

import google.generativeai as genai

# Directly configure Gemini API with your key
genai.configure(api_key="AIzaSyCVQ1ZKkAeyP66kp75vLnhRVMhEXHHkcbQ")

# Load the model
model = genai.GenerativeModel('gemini-2.0-pro-exp')  # Using stable model name
chat = model.start_chat()

# Function to handle user messages
def ask_gemini(user_input):
    if user_input.lower() in ['exit', 'quit']:
        return "Gemini Chatbot: Goodbye! 👋"
    
    response = chat.send_message(user_input)
    return f"Gemini Chatbot: {response.text}"

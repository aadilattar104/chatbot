import google.generativeai as genai

genai.configure(api_key="AIzaSyCVQ1ZKkAeyP66kp75vLnhRVMhEXHHkcbQ")  # Replace with your API key

models = genai.list_models()

for model in models:
    print(model.name)

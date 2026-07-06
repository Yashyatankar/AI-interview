from django.test import TestCase

from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Say hello in one sentence."
)

print(response.text)
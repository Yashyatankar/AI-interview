"""
Gemini AI service — question generation + answer evaluation.
Uses the official google-genai SDK with gemini-2.0-flash (free tier).
"""
import json
import re
from google import genai
from google.genai import types
from main import settings
from requests import session

_client = None

GEMINI_API_KEY = settings.GEMINI_API_KEY


def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

MODEL = 'gemini-2.0-flash'


def _clean_json(text: str) -> str:
    """Strip markdown code fences if Gemini wraps JSON in them."""
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return text.strip()


def generate_questions(session) -> list[dict]:
    """
    Ask Gemini to generate `session.total_questions` interview questions.
    Returns a list of dicts matching Question model fields.
    """
    techs = ', '.join(session.programming)
    prompt = f"""
You are a senior technical interviewer. Generate exactly {session.total_questions} interview questions 
for the following role:

- Job Title: {session.job_field}
- Stack: {session.programming}

- Difficulty Level: {session.difficulty}

-FrameWork{session.frameworks}

Return ONLY a valid JSON array (no markdown, no explanation) with exactly {session.total_questions} objects.
Each object must have these exact keys:
{{
  "order": <integer 1-{session.total_questions}>,
  "text": "<the interview question>",
  "topic": "<one of: core_concepts | practical | system_design | best_practices | debugging | behavioral>",
  "difficulty": "<one of: easy | medium | hard>",
  "expected_keywords": ["<keyword1>", "<keyword2>", ...]
}}

Mix topics naturally. For {session.difficulty} level, calibrate the depth accordingly.
Return ONLY the JSON array. No preamble. No markdown.
"""
    client = get_client()
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            max_output_tokens=4096,
        )
    )
    raw = _clean_json(response.text)
    questions = json.loads(raw)
    return questions


def evaluate_answer(question, answer_text: str) -> dict:
    """
    Ask Gemini to evaluate a candidate's answer.
    Returns dict with: score, feedback, strengths, improvements.
    """
    keywords = ', '.join(question.expected_keywords) if question.expected_keywords else 'N/A'
    prompt = f"""
You are a strict but fair technical interviewer. Evaluate the following interview answer.

Question: {question.text}
Topic: {question.topic}
Difficulty: {question.difficulty}
Expected Keywords/Concepts: {keywords}

Candidate's Answer:
{answer_text}

Score the answer from 0 to 10 based on:
- Technical accuracy (40%)
- Depth and completeness (30%)  
- Clarity of explanation (20%)
- Use of relevant concepts (10%)

Return ONLY a valid JSON object (no markdown, no explanation):
{{
  "score": <float 0.0-10.0>,
  "feedback": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}}

Be honest. A blank or irrelevant answer should score 0. A perfect answer scores 10.
Return ONLY the JSON object. No preamble. No markdown.
"""
    client = get_client()
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.3,
            max_output_tokens=1024,
        )
    )
    raw = _clean_json(response.text)
    result = json.loads(raw)
    result['score'] = max(0.0, min(10.0, float(result.get('score', 0))))
    return result
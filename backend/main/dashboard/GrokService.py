"""
Groq AI service — question generation + answer evaluation.
Uses Groq's OpenAI-compatible API (fast inference, open-source models).
"""
import json
import re
from openai import OpenAI
from main import settings

_client = None

def get_client():
    global _client
    if _client is None:
        _client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )
    return _client

MODEL = 'llama-3.3-70b-versatile'


def _clean_json(text: str) -> str:
    """Strip markdown code fences if the model wraps JSON in them."""
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return text.strip()


def generate_questions(session) -> list[dict]:
    prompt = f"""
You are a senior technical interviewer. Generate exactly {session.total_questions} interview questions 
for the following role:

- Job Title: {session.job_field}
- Stack: {session.programming}
- Difficulty Level: {session.difficulty}
- Frameworks: {session.frameworks}

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
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=4096,
    )
    raw = _clean_json(response.choices[0].message.content)
    questions = json.loads(raw)
    return questions


def evaluate_answer(question, answer_text: str) -> dict:
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
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1024,
    )
    raw = _clean_json(response.choices[0].message.content)
    result = json.loads(raw)
    result['score'] = max(0.0, min(10.0, float(result.get('score', 0))))
    return result
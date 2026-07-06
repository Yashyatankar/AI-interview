const BASE = '/api/sessions';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

export const createSession = async ({ programming, frameworks, job_field, difficulty, total_questions }) => {
  const res = await fetch(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ programming, frameworks, job_field, difficulty, total_questions }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw err; // { frameworks: "[...] are not valid..." } or { error, details }
  }
  return res.json();
};

export const getSession = async (sessionId) => {
  const res = await fetch(`${BASE}/${sessionId}/`, { headers: authHeaders() });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const listSessions = async () => {
  const res = await fetch(`${BASE}/`, { headers: authHeaders() });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const submitAnswer = async (sessionId, { question_id, answer_text, time_taken_seconds }) => {
  const res = await fetch(`${BASE}/${sessionId}/submit-answer/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ question_id, answer_text, time_taken_seconds }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};
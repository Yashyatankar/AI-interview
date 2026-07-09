import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './SideBar';
import { getSession, submitAnswer } from './apis/interview';
import { useNavigate } from "react-router-dom";


const InputValues = ({ value, onChange, onSubmit, loading }) => (
  <div className="p-4 border-t border-gray-800 bg-gray-950">
    <div className="relative max-w-4xl mx-auto flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && onSubmit()}
        placeholder="Enter your Answer here..."
        className="flex-1 p-3 pl-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? '...' : 'Submit'}
      </button>
    </div>
  </div>
);

const Session = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSession(sessionId);
        setSession(data);
        const firstUnanswered = data.questions.findIndex((q) => !q.has_answer);
        setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
      } catch (err) {
        setError('Failed to load session');
      } finally {
        setInitializing(false);
        setStartTime(Date.now());
      }
    })();
  }, [sessionId]);

  const currentQuestion = session?.questions?.[currentIndex];
  const isLastQuestion = session && currentIndex >= session.questions.length - 1;

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQuestion || loading) return;
    setLoading(true);
    setError(null);
    try {
      const time_taken_seconds = Math.round((Date.now() - startTime) / 1000);
      const result = await submitAnswer(sessionId, {
        question_id: currentQuestion.id,
        answer_text: answer,
        time_taken_seconds,
      });
      setEvaluation(result);
      setAnswer('');

      if (!isLastQuestion) {
        setCurrentIndex((i) => i + 1);
        setStartTime(Date.now());
      } else {
        const refreshed = await getSession(sessionId);
        setSession(refreshed);
      }
    } catch (err) {
      setError(err.error || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  return (
    <section className="bg-black text-white h-screen w-full flex overflow-hidden font-sans">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-200">Interview Session</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
          
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            {initializing ? (
              <p className="text-gray-400 text-center py-20">Loading session...</p>
            ) : session?.status === 'completed' ? (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">
                <h3 className="text-xl font-semibold mb-2">Interview Complete</h3>
                <p className="text-gray-300">Overall Score: {session.overall_score}/10</p>
                <div className="mt-4 text-left space-y-1">
                  {Object.entries(session.topic_breakdown || {}).map(([topic, score]) => (
                    <p key={topic} className="text-gray-400 text-sm">{topic}: {score}/10</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-2">
                  Question {currentIndex + 1} of {session?.questions?.length}
                </h3>
                <p className="text-gray-300">{currentQuestion?.text}</p>
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {evaluation && (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                <p className="text-gray-300">Score: {evaluation.score}/10</p>
                <p className="text-gray-400 mb-2">{evaluation.feedback}</p>
                {evaluation.strengths?.length > 0 && (
                  <p className="text-green-400 text-sm">Strengths: {evaluation.strengths.join(', ')}</p>
                )}
                {evaluation.improvements?.length > 0 && (
                  <p className="text-yellow-400 text-sm">Improve: {evaluation.improvements.join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </main>

        {session?.status !== 'completed' && (
          <InputValues value={answer} onChange={setAnswer} onSubmit={handleSubmit} loading={loading} />
        )}
      </div>

      
    </section>
  );
};

export default Session;
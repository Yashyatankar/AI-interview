import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from './apis/interview';
import { FRAMEWORKS_BY_LANGUAGE } from './constants';

const SessionSetup = () => {
  const navigate = useNavigate();
  const [programming, setProgramming] = useState('python');
  const [frameworks, setFrameworks] = useState([]);
  const [jobField, setJobField] = useState('backend');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableFrameworks = FRAMEWORKS_BY_LANGUAGE[programming] || [];

  const toggleFramework = (fw) => {
    setFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  };

  const handleStart = async () => {
    if (frameworks.length === 0) {
      setError('Select at least one framework.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const session = await createSession({
        programming,
        frameworks,
        job_field: jobField,
        difficulty,
        total_questions: totalQuestions,
      });

      navigate(`/session/${session.id}`);
    } catch (err) {
      setError(err.frameworks || err.error || 'Failed to create session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0F1420] text-white min-h-screen w-full flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-[#121827] border border-gray-800 rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold">Configure Your Interview</h1>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Language</label>
          <select
            value={programming}
            onChange={(e) => { setProgramming(e.target.value); setFrameworks([]); }}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white"
          >
            {Object.keys(FRAMEWORKS_BY_LANGUAGE).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Frameworks</label>
          <div className="flex flex-wrap gap-2">
            {availableFrameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => toggleFramework(fw)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  frameworks.includes(fw)
                    ? 'bg-[#6366F1] border-blue-500'
                    : 'bg-[#121827] border-gray-700 text-gray-300'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Job Field</label>
          <input
            type="text"
            value={jobField}
            onChange={(e) => setJobField(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Number of Questions: {totalQuestions}
          </label>
          <input
            type="range"
            min={5}
            max={15}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{JSON.stringify(error)}</p>}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? 'Generating Questions...' : 'Start Interview'}
        </button>
      </div>
    </section>
  );
};

export default SessionSetup;
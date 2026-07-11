// HistorySection.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function HistorySection() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const COLLAPSED_HEIGHT = 250; // px — adjust to roughly 5 rows

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [sessions]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get("/api/sessions/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const scoreColor = (score) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="w-full bg-[#111827] rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-100">Session History</h2>
      </div>

      <div
        ref={wrapperRef}
        className="overflow-x-auto overflow-y-hidden transition-[max-height] duration-500 ease-in-out"
        style={{
          maxHeight: showMore ? `${contentRef.current?.scrollHeight ?? 2000}px` : `${COLLAPSED_HEIGHT}px`,
        }}
      >
        <div ref={contentRef}>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#0F1420] text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-3">Job Field</th>
                <th className="px-6 py-3">Tech Stack</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Questions</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading sessions...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No sessions attempted yet.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#161d2e] transition-colors">
                    <td className="px-6 py-4 text-gray-200 font-medium">{session.job_field}</td>
                    <td className="px-6 py-4 text-gray-400">{session.programming}</td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(session.created_at)}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {session.total_questions ?? session.session?.length}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${scoreColor(session.overall_score)}`}>
                      {session.overall_score?.toFixed(1) ?? "—"}/10
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => (window.location.href = `/sessions/${session.id}`)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showButton && (
        <div className="px-6 py-4 border-t border-gray-800 flex justify-center">
          <button
            className="text-indigo-400 hover:text-indigo-300 font-medium"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
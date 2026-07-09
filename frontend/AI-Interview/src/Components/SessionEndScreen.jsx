import { useNavigate } from "react-router-dom";

export default function SessionEndScreen({ results }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center px-6">
      {/* your existing results/score display */}
      
      <div className="mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
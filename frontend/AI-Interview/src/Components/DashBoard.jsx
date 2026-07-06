import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { 
  Code2, 
  Terminal, 
  BrainCircuit, 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Clock, 
  Target, 
  Trophy,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Sidebar from './Sidebar'; // Importing the Sidebar component you have already created

// Mock data matching the Django backend structure
const performanceData = [
  { topic: 'System Design', score: 85, fullMark: 100 },
  { topic: 'Core Concepts', score: 92, fullMark: 100 },
  { topic: 'Debugging', score: 75, fullMark: 100 },
  { topic: 'Best Practices', score: 88, fullMark: 100 },
  { topic: 'Practical', score: 90, fullMark: 100 },
  { topic: 'Behavioral', score: 95, fullMark: 100 },
];

const progressionData = [
  { session: 'Int #1', score: 6.5 },
  { session: 'Int #2', score: 7.2 },
  { session: 'Int #3', score: 7.0 },
  { session: 'Int #4', score: 8.1 },
  { session: 'Int #5', score: 8.5 },
  { session: 'Int #6', score: 9.2 },
];

const sessionHistory = [
  { id: 'S-1029', role: 'Backend Dev', language: 'Python', frameworks: ['Django', 'FastAPI'], difficulty: 'hard', score: 9.2, date: 'Today', status: 'completed', time: '45m' },
  { id: 'S-1028', role: 'Fullstack Dev', language: 'JavaScript', frameworks: ['React', 'Node.js'], difficulty: 'medium', score: 8.5, date: 'Yesterday', status: 'completed', time: '52m' },
  { id: 'S-1027', role: 'Frontend Dev', language: 'JavaScript', frameworks: ['React'], difficulty: 'hard', score: 8.1, date: 'Jun 26', status: 'completed', time: '40m' },
  { id: 'S-1026', role: 'Systems Eng', language: 'Rust', frameworks: ['Actix'], difficulty: 'medium', score: null, date: 'Jun 24', status: 'ongoing', time: '12m' },
  { id: 'S-1025', role: 'Backend Dev', language: 'Python', frameworks: ['Flask'], difficulty: 'easy', score: 7.0, date: 'Jun 20', status: 'completed', time: '30m' },
];

const PRIMARY_COLOR = '#5736c6';

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const StatBadge = ({ icon: Icon, title, value, subtext, trend }) => (
  <Card className="p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      </div>
      <div className="p-3 bg-[#5736c6]/20 rounded-lg">
        <Icon size={24} color={PRIMARY_COLOR} />
      </div>
    </div>
    <div className="flex items-center text-sm mt-2">
      {trend > 0 ? (
        <span className="text-emerald-400 flex items-center font-medium">
          <TrendingUp size={16} className="mr-1" /> +{trend}%
        </span>
      ) : (
        <span className="text-gray-500 flex items-center">{subtext}</span>
      )}
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </Card>
);

// Removed the local Sidebar component block from here to utilize your external <Sidebar /> component

const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Performance by Topic</h3>
        <p className="text-sm text-gray-400">Your average scores across different assessment areas</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="topic" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#4B5563' }} />
            <Radar
              name="Score"
              dataKey="score"
              stroke={PRIMARY_COLOR}
              fill={PRIMARY_COLOR}
              fillOpacity={0.4}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
              itemStyle={{ color: '#a88bff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>

    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Overall Score Progression</h3>
        <p className="text-sm text-gray-400">Your performance trend over the last 6 sessions</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.5}/>
                <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="session" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" domain={[0, 10]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="score" stroke={PRIMARY_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
);

const HistoryTable = () => (
  <Card className="overflow-hidden">
    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">Recent Interview Sessions</h3>
        <p className="text-sm text-gray-400">A detailed history of your past assessments</p>
      </div>
      <button className="text-sm text-[#a88bff] hover:text-white font-medium transition-colors">
        View All History &rarr;
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-950/50 text-gray-500 font-medium border-b border-gray-800 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Session ID</th>
            <th className="px-6 py-4">Role & Stack</th>
            <th className="px-6 py-4">Difficulty</th>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Overall Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sessionHistory.map((session) => (
            <tr key={session.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-mono text-gray-300">{session.id}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-white mb-1">{session.role}</div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 bg-gray-800 rounded text-gray-300 border border-gray-700">{session.language}</span>
                  {session.frameworks.map(fw => (
                    <span key={fw} className="px-2 py-0.5 bg-gray-800 rounded text-gray-300 border border-gray-700">{fw}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                  ${session.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                  ${session.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                  ${session.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                `}>
                  {session.difficulty}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-300">{session.date}</div>
                <div className="text-xs flex items-center mt-1"><Clock size={12} className="mr-1" /> {session.time}</div>
              </td>
              <td className="px-6 py-4">
                {session.status === 'completed' ? (
                  <span className="flex items-center text-emerald-400">
                    <CheckCircle2 size={16} className="mr-1.5" /> Completed
                  </span>
                ) : (
                  <span className="flex items-center text-amber-400">
                    <AlertCircle size={16} className="mr-1.5" /> Ongoing
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {session.score ? (
                  <span className="text-lg font-bold text-white bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                    {session.score.toFixed(1)}<span className="text-gray-500 text-sm font-normal">/10</span>
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export default function App() {

  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black font-sans text-gray-200 flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-8 py-6 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, Developer</h1>
            <p className="text-gray-400 text-sm mt-1">Track your AI interview progress and performance metrics.</p>
          </div>
          <button 
          onClick={() => navigate('/session-setup')}
          className="flex items-center space-x-2 bg-[#5736c6] hover:bg-[#6842e6] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(87,54,198,0.4)]">
            <Play size={18} fill="currentColor" />
            <span>Start Interview</span>
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBadge 
              icon={Target} 
              title="Total Sessions" 
              value="24" 
              trend={12} 
            />
            <StatBadge 
              icon={Trophy} 
              title="Average Score" 
              value="8.2 / 10" 
              trend={5} 
            />
            <StatBadge 
              icon={Code2} 
              title="Top Skill" 
              value="Python" 
              subtext="Highest scoring tech" 
              trend={0}
            />
            <StatBadge 
              icon={Clock} 
              title="Time Practicing" 
              value="18h 45m" 
              trend={24} 
            />
          </div>

          <ChartsSection />
          
          <HistoryTable />
        </div>
      </main>
    </div>
  );
}
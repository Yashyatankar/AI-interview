import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// --- Root ---
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0a0e27_0%,#1a1f3a_50%,#0d1b2a_100%)] flex justify-center items-center text-[#e0e0e0] font-sans p-4">
      <div className="w-full max-w-[450px]">
        {isLogin
          ? <LoginForm onToggle={() => setIsLogin(false)} />
          : <SignupForm onToggle={() => setIsLogin(true)} />
        }
      </div>
    </div>
  );
}

// --- Social Buttons ---
function SocialAuth() {
  return (
    <div className="flex gap-3 mb-5">
      {['Google', 'GitHub'].map((p) => (
        <button
          key={p}
          onClick={() => alert(`${p} OAuth coming soon!`)}
          className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#c0c0c0] text-xs font-medium cursor-pointer transition-all duration-300 hover:bg-[#ff6bb9]/10 hover:border-[#ff6bb9]/30"
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// --- Divider ---
function Divider() {
  return <div className="text-center my-6 text-[#606060] text-xs tracking-wider">OR</div>;
}

// --- Status Message ---
function StatusMsg({ message, type }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-500/10 border border-red-500/25 text-red-400',
    success: 'bg-green-500/10 border border-green-500/25 text-green-400',
  };
  return (
    <p className={`mt-3 text-xs text-center px-3 py-2 rounded-lg ${styles[type]}`}>
      {message}
    </p>
  );
}

// --- Login Form ---
function LoginForm({ onToggle }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { message, type }
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/auth/login/', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      setStatus({ message: res.data.message, type: 'success' });
      // navigate('/dashboard');  // uncomment when React Router is set up

    } catch (err) {
      const data = err.response?.data;
      const msg = data?.non_field_errors?.[0] || data?.detail || 'Invalid credentials. Try again.';
      setStatus({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-white/5 border rounded-lg text-[#e0e0e0] text-sm placeholder-[#606060] focus:outline-none focus:bg-white/10 transition-all duration-300 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500/70'
        : 'border-[#ff6bb9]/20 focus:border-[#ff6bb9]/50 focus:shadow-[0_0_10px_rgba(255,107,185,0.2)]'
    }`;

  return (
    <div className="bg-[#14192d]/80 backdrop-blur-md border border-[#ff6bb9]/10 rounded-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-7">
        <h1 className="text-3xl font-bold mb-2 bg-[linear-gradient(135deg,#ff6bb9_0%,#00d4ff_100%)] bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-sm text-[#a0a0a0]">Sign in to your account</p>
      </div>

      <SocialAuth />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={inputClass('password')}
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[linear-gradient(135deg,#ff6bb9_0%,#ff1493_100%)] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,107,185,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <StatusMsg message={status?.message} type={status?.type} />

      <div className="text-center mt-5 text-sm text-[#e0e0e0]">
        Don't have an account?{' '}
        <span onClick={onToggle} className="text-[#ff6bb9] font-semibold cursor-pointer hover:text-[#00d4ff] transition-colors duration-300">
          Sign up
        </span>
      </div>
    </div>
  );
}

// --- Signup Form ---
function SignupForm({ onToggle }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = 'Username is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('access', res.data.tokens.access);
      localStorage.setItem('refresh', res.data.tokens.refresh);
      setStatus({ message: res.data.message, type: 'success' });
      setTimeout(() => onToggle(), 1500);

    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.email?.[0] ||
        data?.username?.[0] ||
        data?.password?.[0] ||
        data?.detail ||
        'Signup failed. Please try again.';
      setStatus({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-white/5 border rounded-lg text-[#e0e0e0] text-sm placeholder-[#606060] focus:outline-none focus:bg-white/10 transition-all duration-300 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500/70'
        : 'border-[#ff6bb9]/20 focus:border-[#ff6bb9]/50 focus:shadow-[0_0_10px_rgba(255,107,185,0.2)]'
    }`;

  return (
    <div className="bg-[#14192d]/80 backdrop-blur-md border border-[#ff6bb9]/10 rounded-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-7">
        <h1 className="text-3xl font-bold mb-2 bg-[linear-gradient(135deg,#ff6bb9_0%,#00d4ff_100%)] bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-sm text-[#a0a0a0]">Join us today</p>
      </div>

      <SocialAuth />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: 'Username', field: 'username', type: 'text', placeholder: 'Choose a username' },
          { label: 'Email Address', field: 'email', type: 'email', placeholder: 'your@email.com' },
          { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••' },
          { label: 'Confirm Password', field: 'confirmPassword', type: 'password', placeholder: '••••••••' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block mb-2 text-sm font-medium text-[#c0c0c0]">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className={inputClass(field)}
            />
            {errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[linear-gradient(135deg,#00d4ff_0%,#0099cc_100%)] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,212,255,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <StatusMsg message={status?.message} type={status?.type} />

      <div className="text-center mt-5 text-sm text-[#e0e0e0]">
        Already have an account?{' '}
        <span onClick={onToggle} className="text-[#ff6bb9] font-semibold cursor-pointer hover:text-[#00d4ff] transition-colors duration-300">
          Sign in
        </span>
      </div>
    </div>
  );
}
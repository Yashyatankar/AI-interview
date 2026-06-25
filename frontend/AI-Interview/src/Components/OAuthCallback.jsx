import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/' });

export function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      navigate('/dashboard');
      return;
    }

    api.post('/accounts/auth/google/callback/', { code })
      .then(res => {
        localStorage.setItem('access', res.data.tokens.access);
        localStorage.setItem('refresh', res.data.tokens.refresh);
        navigate('/dashboard');
      })
      .catch(() => navigate('/dashboard'));
  }, []);

  return <div className="min-h-screen flex items-center justify-center text-white">Signing you in with Google...</div>;
}

export function GithubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      navigate('/dashboard');
      return;
    }

    api.post('/accounts/auth/github/callback/', { code })
      .then(res => {
        localStorage.setItem('access', res.data.tokens.access);
        localStorage.setItem('refresh', res.data.tokens.refresh);
        navigate('/dashboard');
      })
      .catch(() => navigate('/dashboard'));
  }, []);

  return <div className="min-h-screen flex items-center justify-center text-white">Signing you in with GitHub...</div>;
}
export default { GoogleCallback, GithubCallback };
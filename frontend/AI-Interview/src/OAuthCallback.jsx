import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

export default function OAuthCallback({ provider }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // Send the short-lived auth code directly to your Django social endpoint
      api.post(`/accounts/${provider}/callback/`, { code: code })
        .then((res) => {
          // Mirroring your regular email login handling
          localStorage.setItem('access', res.data.tokens.access);
          localStorage.setItem('refresh', res.data.tokens.refresh);
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error(`${provider} auth error:`, err);
          setError('Authentication failed. Please try signing in again.');
        });
    } else {
      setError('No authorization code detected.');
    }
  }, [searchParams, provider, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0e27] flex flex-col justify-center items-center text-white font-sans p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-sm hover:bg-[#ff6bb9]/20"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#ff6bb9] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[#a0a0a0]">Completing secure sign-in with {provider}...</p>
        </div>
      )}
    </div>
  );
}
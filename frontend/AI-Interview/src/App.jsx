import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthPage';
import DashBoard from './Components/DashBoard';
import OAuthCallback from './Components/OAuthCallback';
import Session from './Components/Session';
import SessionSetup from './Components/SessionSetup';
import SessionHistory from './Components/SessionHistory';

const { GoogleCallback, GithubCallback } = OAuthCallback;

export default function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/history" element={<SessionHistory />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/session-setup" element={<SessionSetup />} />
        <Route path="/session/:sessionId" element={<Session />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}
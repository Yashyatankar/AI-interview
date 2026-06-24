import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthPage';
import OAuthCallback from './OAuthCallback';
import DashBoard from './Components/DashBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        <Route path="/auth/google/callback" element={<OAuthCallback provider="google" />} />
        <Route path="/auth/github/callback" element={<OAuthCallback provider="github" />} />
        
        <Route path="/dashboard" element={<DashBoard/>} />
      </Routes>
    </BrowserRouter>
  );
}
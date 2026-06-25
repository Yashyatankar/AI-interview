import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthPage';
import DashBoard from './Components/DashBoard';
import OAuthCallback from './Components/OAuthCallback';

const { GoogleCallback, GithubCallback } = OAuthCallback;

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        
        <Route path="/dashboard" element={<DashBoard/>} />
      </Routes>
    </BrowserRouter>
  );
}
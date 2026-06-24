import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthPage';
import OAuthCallback from './OAuthCallback'; // The new component we will make next

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Login / Signup View */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Handles incoming authorization code from social logins */}
        <Route path="/auth/google/callback" element={<OAuthCallback provider="google" />} />
        <Route path="/auth/github/callback" element={<OAuthCallback provider="github" />} />
        
        {/* Dummy Dashboard Route for post-login */}
        <Route path="/dashboard" element={<div className="text-white p-10">Welcome to your Dashboard!</div>} />
      </Routes>
    </BrowserRouter>
  );
}
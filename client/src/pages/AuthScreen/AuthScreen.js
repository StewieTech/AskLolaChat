// src/components/AuthScreen.js
import React from 'react';
import '../AuthScreen/AuthScreen.css';
import axios from 'axios';

const AuthScreen = () => {
  
  const handleEmailAuth = () => {
    // Placeholder for email signup/login logic
    axios.post('/api/auth/email')
      .then(response => {
        console.log('Email auth successful:', response.data);
      })
      .catch(error => {
        console.error('Error with email auth:', error);
      });
  };

  const handleAppleAuth = () => {
    // Placeholder for Apple signup/login logic
    axios.post('/api/auth/apple')
      .then(response => {
        console.log('Apple auth successful:', response.data);
      })
      .catch(error => {
        console.error('Error with Apple auth:', error);
      });
  };

  const handleGoogleAuth = () => {
    // Placeholder for Google signup/login logic
    axios.post('/api/auth/google')
      .then(response => {
        console.log('Google auth successful:', response.data);
      })
      .catch(error => {
        console.error('Error with Google auth:', error);
      });
  };

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <h1>Lola</h1>
      </div>
      <p className="auth-subtitle">The AI Companion who cares</p>
      <p>Create account or log in with options below</p>
      <button className="auth-button email" onClick={handleEmailAuth}>
        Continue with Email
      </button>
      <button className="auth-button apple" onClick={handleAppleAuth}>
        Continue with Apple
      </button>
      <button className="auth-button google" onClick={handleGoogleAuth}>
        Continue with Google
      </button>
      <p className="auth-terms">
        By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
      </p>
    </div>
  );
};

export default AuthScreen;

import React, { createContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage when app initializes
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
      fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user); // Set user data from backend
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    fetchUserProfile(token);
    
  };

  const handleLogout = () => {
    googleLogout();
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

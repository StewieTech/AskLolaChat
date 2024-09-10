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
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setUser(JSON.parse(storedUser));
      // fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      if (!token) return;
      
      console.log('Fetching user profile with token:', token); // Debug log
      const res = await fetch('http://localhost:3001/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user); // Set user data from backend
        console.log('User profile fetched:', data.user);

      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const login = (token, user) => {
    localStorage.setItem('authToken', token); // what's this line do again ?
    localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage

    setAuthToken(token);
    setUser(user);
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

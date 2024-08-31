// RegistrationForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import  GoogleOAuth  from '/GoogleOAuth';
// import GoogleOAuth from './GoogleOAuth';
import GoogleOAuth from '../components/authentication/GoogleOAuth';
import AuthContext from '../components/authentication/AuthContext';


const RegistrationForm = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [formMode, setFormMode] = useState(null);
  const [name, setName] = useState(' ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogout = () => {
    navigate('/');
  }



  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Registration was successful, you can redirect or show a success message
        console.log('Registration successful');
        console.log(name, email);
        navigate('/register-success');
        setTimeout(() => {
          navigate('/');
          // eventually add isRegistered? LoL
        }, 3000);
      } else {
        // Handle registration errors
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    try {

  const response = await fetch('http://localhost:3001/register/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    console.log('Login successful');
    console.log(email)
    navigate('/dashboard');
  } else { 
    console.error('Login failed');
    console.log(email);
    navigate('/');
  } 
}
  catch (error) {
    console.error('Error during login ', error);
  }

  

  };


  

  return (
    <div>
      {formMode === null && (
        <div className="button-container">
          <button className="form-button" onClick={() => setFormMode('login')}>Login with Email</button>
          <button className ="form-button" onClick={() => setFormMode('register')}>Register</button>
        </div>
      )}
      
      {formMode === 'register' && (
    <div>
      {isLoggedIn ? (
     console.log('nice registration form')
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  )}

{formMode === 'login' && (
  <div>

  {!isLoggedIn ? (
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
      <button className="auth-button" onClick={handleLogout}>Logout</button>
    )}
  </div>
      )}
    </div>
    

      )}
    
export default RegistrationForm;

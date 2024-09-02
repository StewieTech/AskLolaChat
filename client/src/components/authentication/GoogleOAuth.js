import React, { useState, useEffect, useContext } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';


function GoogleOAuth() { 
  const [clientId, setClientId] = useState('');
  const {isLoggedIn, setIsLoggedIn, handleLogout} = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
   
    const data = { clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID };
    setClientId(data.clientId);
    // console.log('clientId:', data.clientId);
  }, []);
  

  // This was some workaround trying another method
  // const onSuccess = (res) => {
  //   console.log("Login Success! Current user: ", res.profileObj);
  // };
  const onSuccess = (res) => {
    console.log("Login Success! Current user: ", res.profileObj);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const onFailure = (res) => {
    console.error("Login Failed: ", res);
  };


  if (!clientId) {
    return <p>Loading...</p>; // Or any other loading indicator
  }

  return (
    <div id="authButtons">
    {!isLoggedIn ? (

      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    ) : (
      <button className="auth-button" onClick={handleLogout}>Logout</button>
    )}
    </div>
  );
}

export default GoogleOAuth;


import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
import App from '../App';

function App2() {
    const [accessToken, setAccessToken] = useState(null);

    const { initiateLogin } = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (codeResponse) => {
            console.log('Authorization Code: ', codeResponse.code);
            setAccessToken(codeResponse.code);
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    const handleLoginClick = () => {
        initiateLogin();
    };

    const handleLogoutClick = () => {
        googleLogout();
        setAccessToken(null);
    }


    return (
        <GoogleOAuthProvider clientId= {process.env.GOOGLE_CLIENT_ID} >
        <div className="App">
        {accessToken ? (
            <div>
            <h1>Welcome User</h1>
            <p>Access Token: {accessToken}</p>
            <button onClick={handleLogoutClick}>Sign Out</button>
            </div>
        ) : (
            <div>
            <h1>Login with Gogole</h1>
            <button onClick={handleLoginClick}>Sign In with Google</button>
            </div>
        )}

          <App/>
        </div>
        </GoogleOAuthProvider>
    );

}


export default App
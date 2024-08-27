import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function App() {
    return (
        <GoogleOAuthProvider clientId= {process.env.GOOGLE_CLIENT_ID} >
        <div className="App">
<GoogleLogin 
    onSucces={credentialResponse => {
        console.log(credentialResponse);
    }}
    onError={() => {
        console.log('Login Failed');
    }}
/>;
          
        </div>
        </GoogleOAuthProvider>
    );

}


export default App
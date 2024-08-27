import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Login() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/google-auth')
      .then(response => response.json())
      .then(data => {
        setClientId(data.clientId);
        setClientSecret(data.clientSecret);
      })
      .catch(error => console.error(error));
  }, []);

  
  const onSuccess = (res) => {
    console.log("Login Success!! Current user: ", res.profileObj);
  }

  const onFailure = (res) => {
    console.log("Login FAILED BABY!! res: ", res);
  }

  console.log(clientId, clientSecret);


  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      clientSecret={process.env.GOOGLE_CLIENT_SECRET}
    >
      <div id="signInButton">
        <GoogleLogin
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
        <p>Google Login button rendered successfully!</p>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login;
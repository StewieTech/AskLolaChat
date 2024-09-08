// Library Imports
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/authentication/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// I don't believe I need below
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import GoogleOAuth from './components/authentication/GoogleOAuth';
import RegistrationSuccess from './components/common/RegistrationSuccess';
import RegistrationForm from './pages/RegistrationForm';
// import Header from './components/Header';
import NonsenseFooter from './components/common/NonsenseFooter';
import DashboardNav from './components/common/Dashboard';
import AuthScreen from './pages/AuthScreen/AuthScreen';
import LolaChat from './components/features/messages/LolaChat';
import Header from './components/common/Header';
import RegisterScreen from './pages/RegisterScreen/RegisterScreen';
import ProfileScreen from './pages/ProfileScreen/ProfileScreen';

// Assets LoL I am deleting all this wtf ??
import './App.css';
import './css/Base.css';
import './css/Typography.css';
import './css/FormsAndButtons.css';
import './css/Animations.css';
import LoginScreen from './pages/LoginScreen/LoginScreen';

function App() {

	const backendAddress = process.env.REACT_APP_API_URL;
	// const backendAddress = `http://localhost:3001` ; // test
  console.log("backend Address: ", backendAddress)

	return (
		<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
			<Router>
				<AuthProvider>
					<Container fluid>
          <Header />
						<div className="App">
						<Routes>
							<Route path="/LolaChat" element={<LolaChat backendAddress={backendAddress} />} />
							<Route path="/" element={<Navigate to="LolaChat" replace />} />
							<Route path="/login" exact element={<LoginScreen />} />
							<Route path="/register" element={<RegisterScreen />} />
							<Route path="/profile" element={<ProfileScreen />} />
							<Route path="/auth" element={<AuthScreen />} />
						</Routes>
						<NonsenseFooter />
						</div>
					</Container>
							<GoogleOAuth />
				</AuthProvider>
			</Router>
		</GoogleOAuthProvider>
	);
}

export default App;

// to runnnn app use : npm run dev
// aws s3 sync build/ s3://lola-s3
// REACT_APP_API_URL=https://lola-back.onrender.com/
// REACT_APP_API_URL=http://3.80.220.82:3001/

// What do I need before deploying the app

// A way for users to login
// login users ask 5 questions
// then pop up for them to pay comes up
// pop up copies rizz (share for free, pay for more)


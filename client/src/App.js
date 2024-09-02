// Library Imports
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/authentication/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// I don't believe I need below
// import 'bootstrap/dist/css/bootstrap.min.css';

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

// Assets LoL I am deleting all this wtf ??
import './App.css';
import './css/Base.css';
import './css/Typography.css';
import './css/FormsAndButtons.css';
import './css/Animations.css';

// Constants probably in Lola Chat
const MIN_TIMEOUT = 2500;
const MAX_TIMEOUT = 5000;
const MAX_QUESTION_LIMIT_FREE = 10;

console.log(process.env.REACT_APP_API_URL);
console.log('Hey');

function App() {
	const [message, setMessage] = useState('');
	const [response, setResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const randomTimeout = Math.floor(Math.random() * MAX_TIMEOUT - MIN_TIMEOUT + 1) + MIN_TIMEOUT;
	const [imageFile, setImageFile] = useState(null);
	const [imageAttached, setImageAttached] = useState(false);
	const [imagePreviewUrl, setImagePreviewUrl] = useState(' ');
	// const [ocrText, setOcrText] = useState('') ;
	// const [pictureIndex, setPictureIndex] = useState(0);

	const [showProPopup, setShowProPopup] = useState(false);




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
						</div>
						<Routes>
							<Route path="/LolaChat" element={<LolaChat backendAddress={backendAddress} />} />
							<Route path="/" element={<Navigate to="LolaChat" replace />} />
							{/* <Route path="/dashboard" element={<DashboardNav />} /> */}
							{/* <Route path="/login" exact element={<RegistrationForm />} /> */}
							<Route path="/register" element={<RegisterScreen />} />
							{/* <Route path="/register-success" element={<RegistrationSuccess />} /> */}
							<Route path="/auth" element={<AuthScreen />} />
						</Routes>
						<NonsenseFooter />
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

// I can remove the OCR and upload it when it fully works
// Just need to commit all of it out

// Eventuall
// Fix OCR
// update prompt based on time talking with Lola

// character limit
// if textbox is blank

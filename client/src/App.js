// Library Imports
import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Modal, Badge } from 'react-bootstrap';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/authentication/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// I don't believe I need below
// import 'bootstrap/dist/css/bootstrap.min.css';


// Components
import GoogleOAuth from './components/authentication/GoogleOAuth';
import RegistrationSuccess from './components/common/RegistrationSuccess';
import LoginSuccess from './components/common/LoginSuccess';
import RegistrationForm from './pages/RegistrationForm';
// import Header from './components/Header';
import QuestionCount from './components/features/messages/QuestionCount';
import TextAreaComponent from './components/features/messages/TextAreaComponent';
import NonsenseFooter from './components/common/NonsenseFooter'; 
import ImageDisplayComponent from './components/features/image/ImageDisplayComponent/ImageDisplayComponent';


// Assets
import './App.css';
import './css/Base.css';
import './css/Typography.css';
import './css/FormsAndButtons.css';
import './css/Animations.css';
import DashboardNav from './components/common/Dashboard';



// Constants
const MIN_TIMEOUT = 2500;
const MAX_TIMEOUT = 5000;
const MAX_QUESTION_LIMIT_FREE = 10




console.log(process.env.REACT_APP_API_URL)
console.log("Hey")


function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const randomTimeout = Math.floor(Math.random() * MAX_TIMEOUT - MIN_TIMEOUT +1) + MIN_TIMEOUT ;
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageAttached, setImageAttached] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(' ');
  // const [ocrText, setOcrText] = useState('') ;
  // const [pictureIndex, setPictureIndex] = useState(0);

  var [questionCount, setQuestionCount] = useState(0);
  const [showProPopup, setShowProPopup] = useState(false);
  
  // const [isTextareaBlur, setIsTextareaBlur] = useState(false);
  
  
const handleTextareaFocus = () => {
  setIsTextareaFocused(true);
};

const handleTextareaBlur = () => {
  setIsTextareaFocused(false);
};


useEffect(() => {
  if (questionCount >= MAX_QUESTION_LIMIT_FREE) {
    setShowProPopup(true);
  } else {
    setShowProPopup(false);
  }
}, [questionCount]); // Depend on questionCount to re-run this effect



 // I want to change this to ChatGPT 4

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile((file));
    setImageAttached(true);
    const reader = new FileReader();
reader.onload = () => {
  setImagePreviewUrl(reader.result);
};
reader.readAsDataURL(file);

  }
};




//  const handleImageUpload = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setImageFile(URL.createObjectURL(file));
//     setImageAttached(true);
//   }
//  };
 

 
 /*
 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    const formData = new FormData();
    formData.append('image', file);

    fetch(`${process.env.REACT_APP_API_URL}api/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.choices && data.choices.length > 0) {
          setMessage(data.choices[0].message.content);
        } else {
          console.error('Error extracting text:', data);
        }
      })
      .catch((error) => {
        console.error('Error extracting text:', error);
      });
  }
};
*/

  const handleSignUpForPro = () => {
    setShowProPopup(false);
  }

  const handleCloseProPopup = () => {
    setShowProPopup(false);
  };


// 
  const backendAddress = process.env.REACT_APP_API_URL ;
  // const backendAddress = `http://localhost:3001` ; // test

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); 

    if (imageFile) {
      console.log('File type:', imageFile.type);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('message', message);
      console.log(formData);
      
      fetch('http://localhost:3001/api/upload', {
      // fetch('${backendAddress}api/upload', {
        method: 'POST',
        body: formData,
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setResponse(data.message);
          setQuestionCount((prevCount) => prevCount + 1);
        } else {
          setResponse('Error: No message received');
        }
      })
      .catch((error) => {
        console.log('Error GPT4 not fetching: ', error);
        setResponse('Error: Request failed');
      })
      .finally(() => {
        setIsLoading(false);
        setImageFile(null); 
        setImageAttached(false);
      });
    } else {
     
      
      setTimeout(() => {

      fetch(backendAddress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message}),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          
          
          setResponse(data.message);
          setQuestionCount((prevCount) => prevCount + 1); 
        } else {
          setResponse('Error: No message received');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        setResponse('Error: Request failed');
      })
      .finally(() => {
        setIsLoading(false); // Set loading back to false when the fetch is complete
      });
      
    }, randomTimeout);

  }
  };

  
return (


  
  
<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <Router>
<AuthProvider>

  <Container fluid>
<div className="glass-container">
    <h1 className="text-center mt-3">Ask Lola 😉</h1>
    </div>

 


    <Row className="justify-content-center">
      <Col xs={12} sm={8} md={6} lg={4}>
      <div className={`textarea-container ${isTextareaFocused ? 'expanded' : ''}`}>


      <TextAreaComponent
        message={message}
        setMessage={setMessage} // This should be a function returned by useState
        isTextareaFocused={isTextareaFocused}
        handleTextareaFocus={handleTextareaFocus}
        handleImageUpload={handleImageUpload}
        handleTextareaBlur={handleTextareaBlur}
        handleSubmit={handleSubmit}
        imageAttached={imageAttached}
        // imagePreview={imageFile}
        imagePreviewUrl={imagePreviewUrl}
      />
       
             </div>
      </Col>
    </Row>

    <QuestionCount
    questionCount={questionCount}
    maxQuestionLimit={MAX_QUESTION_LIMIT_FREE}
    onUpgradeClick={handleSignUpForPro}
  />

     {/* Lola's Response */}
    <Row className="justify-content-center mt-3">
      <Col xs={12} sm={8} md={6} lg={4}>
      {isLoading ? (
        <h2 className="flashyDots"> . </h2> //Show flashy dots while loading
      ) : response && (
        <div className = "animatedResponse">
        <h2>{response}</h2> {/* Show the animated response when not loading */}
        </div>
      )}
      </Col>
    </Row>


    <Row className="justify-content-center mt-3">
      <Col xs={12} sm={8} md={6} lg={4}>
       <ImageDisplayComponent/>
      </Col>
    </Row>
          <NonsenseFooter/>
      <div className="App">
        <GoogleOAuth />
      </div>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<DashboardNav />} />
        <Route path="/login" element={<RegistrationForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/register-success" element={<RegistrationSuccess />} />
      </Routes>
  </Container>
</AuthProvider>
    </Router>
    </GoogleOAuthProvider>

);
}


export default App

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


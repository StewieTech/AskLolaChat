// src/components/RegisterScreen.js
import React, { useRef } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './RegisterScreen.css';

const RegisterScreen = () => {
  const formikRef = useRef(null);

  const initialValues = {
    name: '',
    emailId: '',
    password: '',
  };

  const validationSchema = Yup.object({
    emailId: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      // Send POST request to the register endpoint
      const response = await axios.post('http://localhost:3001/api/users/register', values);

      // If registration is successful
      if (response.data.success) {
        setStatus({ success: 'Registration successful!' });
        setStatus({ error: '' });
        resetForm(); // Reset form on success
        console.log('Registration successful:', response.data);
      } else {
        // Handle unsuccessful registration
        setStatus({ success: '', error: 'Registration failed' });
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setStatus({ success: '', error: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-screen">
      <h2>Create an account</h2>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
          <div className="form-group">
              <Field 
                type="text" 
                name="name" 
                placeholder="Name" 
                className="form-control"
              />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
              <Field 
                type="email" 
                name="emailId" 
                placeholder="Email" 
                className="form-control"
              />
              <ErrorMessage name="emailId" component="div" className="error" />
            </div>
            <div className="form-group">
              <Field 
                type="password" 
                name="password" 
                placeholder="Password" 
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <p>Password must contain at least 8 characters.</p>
            {status && status.error && <div className="error">{status.error}</div>}
            {status && status.success && <div className="success">{status.success}</div>}
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Registering...' : 'Continue'}
            </button>
          </Form>
        )}
      </Formik>
      <p>Already have an account? <a href="/login">Log in</a></p>
      <p>By signing up, you agree to our <a href="/terms">Terms of service</a> and <a href="/privacy">Privacy policy</a></p>
    </div>
  );
};

export default RegisterScreen;

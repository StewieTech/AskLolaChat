import React, { useRef } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Badge from '../../components/common/Badge/Badge'; // Import the Badge component
import './RegisterScreen.css';
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
  const formikRef = useRef(null);
  const navigate = useNavigate();

  const initialValues = {
    emailId: '',
    password: '',
    name: '', // Assuming we also want to collect the user's name
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    emailId: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', values);

      if (response.data.success) {
        setStatus({ success: 'Registration successful!' });
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setStatus({ error: 'Registration failed' });
      }
    } catch (err) {
      setStatus({ error: 'Registration failed. Please try again.' });
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
            
            {/* Display Badge for Success or Error */}
            {status && status.success && (
              <Badge type="success" message={status.success} />
            )}
            {status && status.error && (
              <Badge type="error" message={status.error} />
            )}

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

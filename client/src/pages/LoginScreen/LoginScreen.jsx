import React, { useRef } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Badge from '../../components/common/Badge/Badge'; // Import the Badge component
import './LoginScreen.css';

const LoginScreen = () => {
  const formikRef = useRef(null);

  const initialValues = {
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
      const response = await axios.post('http://localhost:3001/api/users/login', values);

      if (response.data.success) {
        setStatus({ success: 'Login successful!' });
        // resetForm(); // Reset form on success
      } else {
        setStatus({ error: 'Login failed' });
      }
    } catch (err) {
      setStatus({ error: 'Login failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <h2>Log in</h2>
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
            <p className="forgot-password">Forgot your password?</p>

            {/* Display Badge for Success or Error */}
            {status && status.success && (
              <Badge type="success" message={status.success} />
            )}
            {status && status.error && (
              <Badge type="error" message={status.error} />
            )}

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Logging in...' : 'Continue'}
            </button>
          </Form>
        )}
      </Formik>
      <p>New to our platform? <a href="/register">Create an account</a></p>
    </div>
  );
};

export default LoginScreen;

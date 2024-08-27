import { FiCamera, FiArrowRight } from 'react-icons/fi';
import {Container, Row, Col, Form, Button, Modal, Badge } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';


const TextAreaComponent = ({ isTextareaFocused, handleTextareaFocus, handleTextareaBlur}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);  

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there is an image to upload
    if (image) {
        const formData = new FormData();
        formData.append('image', image); // 'image' is the key expected on the server side
        // Append message if it exists
        if (message) formData.append('message', message);

        try {
            // Sending the image (and possibly message) to the backend for GPT-4 processing
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data); // Handle the response data as needed
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    } else if (message) {
        // Only message exists, use GPT-3.5 processing
        try {
            const response = await axios.post('http://localhost:3001', { message }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data); // Handle the response data as needed
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } else {
        // Neither message nor image exist
        console.log('Please enter a message or upload an image.');
    }
};

  return (

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTextarea">
          <Form.Control
            as="textarea"
            value={message}
            placeholder="Ask your wingwomen anything ;)"
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            className={`textarea ${isTextareaFocused ? 'focus' : ''}`}
          />
          {isTextareaFocused ? (
            <FiArrowRight className="icon arrow-icon" />
          ) : (
            <label htmlFor="imageUpload">
              <FiCamera className={`camera-icon ${isTextareaFocused ? 'hidden' : ''}`} />
            </label>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload} // You need to pass handleImageUpload as prop
            style={{ display: 'none'}}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" block>
          Send Message 💜
        </Button>
      </Form>
    );
  };

  export default TextAreaComponent;

  /*
  old code
 <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTextarea">
            <Form.Control
              as="textarea" 
              value={message}
              placeholder="Ask your wingwomen anything ;)"
              onChange={(e) => setMessage(e.target.value)}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              className={`textarea ${isTextareaFocused ? 'focus' : ''}`}
               />

            {isTextareaFocused ? (
              <FiArrowRight className="icon arrow-icon" />
             ) : (
              <label htmlFor="imageUpload">
                <FiCamera className={`camera-icon ${isTextareaFocused ? 'hidden' : ''}`} />
              </label>
             )}

             hidden input file 
             <input
             id="imageUpload"
             type="file"
             accept="image/*"
             onChange={handleImageUpload}
             style={{ display: 'none'}}

             />
               
              

          </Form.Group>
          <Button variant="primary" type="submit" block>
            Send Message 💜 
          </Button>
        </Form>


  */
  
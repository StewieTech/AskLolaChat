// import { FiCamera, FiArrowRight } from 'react-icons/fi';
import { FiCamera, FiArrowRight, FiMic, FiImage, FiSmile, FiPlusCircle } from 'react-icons/fi';

import {Form, Button, Image } from 'react-bootstrap';
import React, { useState } from 'react';
import './TextAreaComponent.css';



const TextAreaComponent = ({message, setMessage, isTextareaFocused, handleTextareaFocus, handleImageUpload, handleTextareaBlur, handleSubmit, imageAttached, imagePreviewUrl}) => {

  const [isMicActive, setIsMicActive] = useState(false);

  const handleMicClick = () => {
    setIsMicActive(true);
  };

  const handleCameraClick = () => {

  };


  return (
    <Form onSubmit={handleSubmit} className="text-area-form">
      <div className={`message-bar ${isTextareaFocused ? 'focused' : ''}`}>
        {/* Left icon (Camera) */}
        <FiCamera className="camera-icon" onClick={handleCameraClick} />

        {/* Textarea for user message */}
        <Form.Control
          as="textarea"
          value={message}
          placeholder="Ask your Relationship Expert anything ;)"
          onChange={(e) => setMessage(e.target.value)}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          className="message-textarea"
        />

        {/* Right side icons */}
        <div className="icons-right">
          <FiMic className={`icon mic-icon ${isMicActive ? 'active' : ''}`} onClick={handleMicClick} />
          <label htmlFor="imageUpload">
            <FiImage className="icon image-icon" />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <FiSmile className="icon smile-icon" />
          <FiPlusCircle className="icon plus-icon" />
        </div>

        {imageAttached && (
          <div className="image-preview">
            <Image src={imagePreviewUrl} alt="Image Preview" fluid />
          </div>
        )}
      </div>

      <Button variant="primary" type="submit" block className="send-button">
        Send Message 💜
      </Button>
    </Form>
  );
};


  export default TextAreaComponent;

// src/components/Chat/Chat.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import TextAreaComponent from './TextAreaComponent';
import ImageDisplayComponent from '../image/ImageDisplayComponent/ImageDisplayComponent';
import QuestionCount from './QuestionCount';

const MIN_TIMEOUT = 2500;
const MAX_TIMEOUT = 5000;
const MAX_QUESTION_LIMIT_FREE = 10;

const LolaChat = ({ backendAddress }) => {
	const [message, setMessage] = useState('');
	const [response, setResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [imageAttached, setImageAttached] = useState(false);
	const [imagePreviewUrl, setImagePreviewUrl] = useState(' ');
	const [questionCount, setQuestionCount] = useState(0);
	const [showProPopup, setShowProPopup] = useState(false);
	// const [isTextareaBlur, setIsTextareaBlur] = useState(false);
	const [isTextareaFocused, setIsTextareaFocused] = useState(false);

	useEffect(() => {
		if (questionCount >= MAX_QUESTION_LIMIT_FREE) {
			setShowProPopup(true);
		} else {
			setShowProPopup(false);
		}
	}, [questionCount]);

	const handleTextareaFocus = () => {
		setIsTextareaFocused(true);
	};

	const handleTextareaBlur = () => {
		setIsTextareaFocused(false);
	};


	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageAttached(true);
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreviewUrl(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		if (imageFile) {
			const formData = new FormData();
			formData.append('image', imageFile);
			formData.append('message', message);
			const url = `${backendAddress}/api/upload`;
			console.log("Sending POST request to: ", url);

			fetch(url, {
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
					console.error('Error:', error);
					setResponse('Error: Request failed');
				})
				.finally(() => {
					setIsLoading(false);
					setImageFile(null);
					setImageAttached(false);
				});
		} else {
			const randomTimeout = Math.floor(Math.random() * (MAX_TIMEOUT - MIN_TIMEOUT + 1)) + MIN_TIMEOUT;
			
			setTimeout(() => {
				fetch(backendAddress, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ message }),
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
						console.error('Error:', error);
						setResponse('Error: Request failed');
					})
					.finally(() => {
						setIsLoading(false);
					});
			}, randomTimeout);
		}
	};

	return (
		<>
			<Row className="justify-content-center">
				<Col xs={12} sm={8} md={6} lg={4}>
					<TextAreaComponent
						message={message}
						setMessage={setMessage}
						isTextareaFocused={isTextareaFocused}
						handleTextareaFocus={handleTextareaFocus}
						handleImageUpload={handleImageUpload}
						handleTextareaBlur={handleTextareaBlur}
						handleSubmit={handleSubmit}
						imageAttached={imageAttached}
						imagePreviewUrl={imagePreviewUrl}
					/>
				</Col>
			</Row>

			{/* Lola's Response */}
			<Row className="justify-content-center mt-3">
				<Col xs={12} sm={8} md={6} lg={4}>
					{isLoading ? (
						<h2 className="flashyDots"> . </h2>
					) : (
						response && (
							<div className="animatedResponse">
								<h2>{response}</h2>
							</div>
						)
					)}
				</Col>
			</Row>

			<Row className="justify-content-center mt-3">
				<Col xs={12} sm={8} md={6} lg={4}>
					<ImageDisplayComponent />
				</Col>
			</Row>

			<QuestionCount
				questionCount={questionCount}
				maxQuestionLimit={MAX_QUESTION_LIMIT_FREE}
				onUpgradeClick={() => setShowProPopup(false)}
			/>
		</>
	);
};

export default LolaChat;

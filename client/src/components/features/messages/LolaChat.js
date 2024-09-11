// src/components/features/LolaChat.js
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col  } from 'react-bootstrap';
import TextAreaComponent from './TextAreaComponent/TextAreaComponent';
import ImageDisplayComponent from '../image/ImageDisplayComponent/ImageDisplayComponent';
import QuestionCount from './QuestionCount';
import { AuthContext } from '../../authentication/AuthContext'

const MIN_TIMEOUT = 2500;
const MAX_TIMEOUT = 5000;
const MAX_QUESTION_LIMIT_FREE = 1;

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
	const { authToken } = useContext(AuthContext) ;

	// useEffect(() => {
	// 	if (questionCount >= MAX_QUESTION_LIMIT_FREE) {
	// 		setShowProPopup(true);
	// 	} else {
	// 		setShowProPopup(false);
	// 	}
	// }, [questionCount]);

	useEffect(() => {
		const fetchQuestionCount = async () => {
			try {
				const res = await fetch(`${backendAddress}/api/lola/question-count`, {
					headers: {
						'Authroization': `Bearer ${authToken}`,
					},
				});
				const data = await res.json();
				setQuestionCount(data.questionCount);
			} catch (error) {
				console.error('Error fetching question count: ', error);
			}
		};
		fetchQuestionCount();
	}, [authToken, backendAddress]);

	const handleQuestionSubmit = async (message) => {
		try {
			const res = await fetch(`${backendAddress}/api/lola/message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authToken}`,
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();

			setQuestionCount(prevCount => prevCount - 1);
		} catch (error) {
			console.error('Error submitting question:', error);
		}
	};



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

		// const token = localStorage.getItem('token');

		if (!authToken) {
			console.error('No toekn found!! Please login!!.');
			setResponse('Error: no token fond!!!. Login PLEASE!');
			return ;
		};

		if (imageFile) {
			const formData = new FormData();
			formData.append('image', imageFile);
			formData.append('message', message);
			const url = `${backendAddress}/api/upload`;
			console.log("Sending POST request to: ", url);

			fetch(url, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
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
			
			
			const url = `${backendAddress}api/messages/lola-text`;
			setTimeout(() => {
				fetch(url, {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authToken}`,
					 },
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
						setResponse('Error: Message (No Image) Request failed');
					})
					.finally(() => {
						setIsLoading(false);
					});
			}, randomTimeout);
		}
	};

	return (
		<>
			<Row className="justify-content-center mt-3">
				<Col xs={6} sm={8} md={10} lg={12}>
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
			<Col xs={6} sm={8} md={10} lg={12}>
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
			<Col xs={6} sm={8} md={10} lg={12}>
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

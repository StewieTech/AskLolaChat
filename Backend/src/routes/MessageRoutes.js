// src/routes/messageRoutes.js

const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Route to send a message to Lola
router.post('/to-lola', messageController.sendTextToLola);

// Route to send a message from Lola to the user
// router.post('/lola-text', messageController.receiveTextFromLola);

// Route to fetch all messages in a Lola session
router.get('/lola/:lolaId', messageController.getMessagesByLolaSession);

// Route to fetch all messages sent by a specific user
router.get('/user/:userId', messageController.getMessagesByUser);

// Route to delete a specific message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;

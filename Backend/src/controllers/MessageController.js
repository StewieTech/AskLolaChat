// src/controllers/messageController.js

const axios = require('axios'); // Importing axios for making HTTP requests
const messageService = require('../services/MessageService'); // Importing the message service

const EXTERNAL_SERVICE_URL = process.env.EXTERNAL_SERVICE_URL; // Load external service URL from environment variables

/**
 * Sends a message from Lola.
 * Handles the HTTP request to send a message from Lola to the user.
 * 
 * @param {Object} req - The request object containing message data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
*/



const receiveTextFromLola = async (req, res) => {
    try {
        const { message } = req.body;
        const lolaTextResponse = await messageService.createLolaTextResponse(message);
        
        const lolaMessageData = {
            // content:  lolaTextResponse,
            // messageType: 'fromLola',
            question: message,
            lolaResponse: lolaTextResponse,
        };
        await messageService.receiveTextFromLola(lolaMessageData);
        
        res.json({ message:  lolaTextResponse});
        // res.status(201).json({ message: 'Message from Lola sent successfully',  });
    } catch (error) {
        console.error('Error processing text message in controller:', error);
        res.status(500).json({ error: 'Failed to process text message' });
    }
}

/**
 * Sends a message to Lola.
 * Handles the HTTP request to send a message to Lola.
 * 
 * @param {Object} req - The request object containing message data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
*/


const sendTextToLola = async (req, res) => {
    try {
        const { message } = req.body;
        
        const lolaMessageData = {
            content: message,
            messageType: 'toLola',
        };
        await messageService.sendMessageToLola(lolaMessageData);
        // const message = await messageService.sendMessageToLola(req.body);

        // Notify an external service of the new message to Lola
        // await axios.post(`${EXTERNAL_SERVICE_URL}/api/message-to-lola`, {
        //     messageId: message._id,
        //     content: message.content,
        //     timestamp: message.timestamp,
        // });

        res.status(201).json({ message: 'Message sent to Lola successfully', message });
    } catch (error) {
        console.error('Error sending message to Lola:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Fetches all messages in a Lola session.
 * Handles the HTTP request to fetch all messages related to a specific Lola session.
 * 
 * @param {Object} req - The request object containing lolaId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */

const getMessagesByLolaSession = async (req, res) => {
    try {
        const messages = await messageService.getMessagesByLolaSession(req.params.lolaId);
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages for Lola session:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Fetches all messages sent by a user.
 * Handles the HTTP request to fetch all messages sent by a specific user.
 * 
 * @param {Object} req - The request object containing userId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const getMessagesByUser = async (req, res) => {
    try {
        const messages = await messageService.getMessagesByUser(req.params.userId);
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages by user:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Deletes a specific message.
 * Handles the HTTP request to delete a message by its ID.
 * 
 * @param {Object} req - The request object containing messageId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const deleteMessage = async (req, res) => {
    try {
        await messageService.deleteMessage(req.params.messageId);

        // Notify an external service after a message is deleted
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/message-deleted`, {
            messageId: req.params.messageId,
        });

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getMessagesByLolaSession,
    getMessagesByUser,
    deleteMessage,
    receiveTextFromLola,
    sendTextToLola
};

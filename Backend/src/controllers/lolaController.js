// src/controllers/lolaController.js

const axios = require('axios'); // Importing axios for making HTTP requests
const lolaService = require('../services/LolaService'); // Importing the Lola service

const EXTERNAL_SERVICE_URL = process.env.EXTERNAL_SERVICE_URL; // Load external service URL from environment variables

/**
 * Starts a new Lola session.
 * Handles the HTTP request to start a new session with Lola.
 * 
 * @param {Object} req - The request object containing session data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const startLolaSession = async (req, res) => {
    try {
        const lolaSession = await lolaService.startLolaSession(req.body);

        // Notify an external service that a new session has started
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/session-started`, {
            sessionId: lolaSession.lolaId,
            userId: lolaSession.userId,
            startTime: lolaSession.sessionStart,
        });

        res.status(201).json({ message: 'Lola session started successfully', lolaSession });
    } catch (error) {
        console.error('Error starting Lola session:', error);
        res.status(400).json({ error: error.message });
    }
};

const getQuestionCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessionData = await lolaService.getQuestionCount(userId);

        res.status(200).json(sessionData);
    } catch (error) {
        console.error('Error fetching question count: ', error);
        res.status(500).json({ success: false, message: 'Failed to fetch question count' });
    }
};

/**
 * Updates Lola relationship level.
 * Handles the HTTP request to update the relationship level between Lola and the user.
 * 
 * @param {Object} req - The request object containing lolaId as a parameter and increment value in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const updateRelationshipLevel = async (req, res) => {
    try {
        const lolaSession = await lolaService.updateRelationshipLevel(req.params.lolaId, req.body.incrementBy);

        // Log the relationship level update to an external service
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/update-relationship`, {
            sessionId: lolaSession.lolaId,
            newLevel: lolaSession.relationshipLevel,
        });

        res.status(200).json({ message: 'Relationship level updated successfully', lolaSession });
    } catch (error) {
        console.error('Error updating relationship level:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Ends a Lola session.
 * Handles the HTTP request to end a session with Lola.
 * 
 * @param {Object} req - The request object containing lolaId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const endLolaSession = async (req, res) => {
    try {
        const lolaSession = await lolaService.endLolaSession(req.params.lolaId);

        // Notify an external system that the session has ended
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/session-ended`, {
            sessionId: lolaSession.lolaId,
            endTime: lolaSession.sessionEnd,
        });

        res.status(200).json({ message: 'Lola session ended successfully', lolaSession });
    } catch (error) {
        console.error('Error ending Lola session:', error);
        res.status(400).json({ error: error.message });
    }
};

const handleQuestionSubmit = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        const updatedSession = await lolaService.handleQuestion(userId, message);

        res.status(200).json({ success: true, updatedSession });
    } catch (error) {
        console.error('Error submitting question: ', error);
        res.status(500).json({success: false, message: 'Failed to submit quetion'});
    }
};



/**
 * Fetches a Lola session by ID.
 * Handles the HTTP request to fetch a Lola session by its ID.
 * 
 * @param {Object} req - The request object containing lolaId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const getLolaSessionById = async (req, res) => {
    try {
        const lolaSession = await lolaService.getLolaSessionById(req.params.lolaId);
        res.status(200).json({ lolaSession });
    } catch (error) {
        console.error('Error fetching Lola session:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    startLolaSession,
    updateRelationshipLevel,
    endLolaSession,
    getLolaSessionById,
    handleQuestionSubmit,
    getQuestionCount,
};

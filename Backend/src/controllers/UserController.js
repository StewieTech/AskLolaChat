// src/controllers/userController.js

const axios = require('axios'); // Importing axios for making HTTP requests
const userService = require('../services/UserService'); // Importing the user service

const EXTERNAL_SERVICE_URL = process.env.EXTERNAL_SERVICE_URL; // Load external service URL from environment variables

/**
 * Registers a new user.
 * Handles the HTTP request to register a new user.
 * 
 * @param {Object} req - The request object containing user data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);

        // Notify an external service that a new user has been registered (e.g., sending a welcome email)
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/user-registered`, {
            userId: user.userId,
            email: user.emailId,
            name: user.name,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Authenticates a user (login).
 * Handles the HTTP request to authenticate a user.
 * 
 * @param {Object} req - The request object containing email and password in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const loginUser = async (req, res) => {
    try {
        const user = await userService.authenticateUser(req.body.emailId, req.body.password);

        // Example: Fetch user-related data from an external API after successful login
        const externalData = await axios.get(`${EXTERNAL_SERVICE_URL}/api/user-data/${user.userId}`);
        
        res.status(200).json({ message: 'Login successful', user, externalData: externalData.data });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Updates user details.
 * Handles the HTTP request to update user details.
 * 
 * @param {Object} req - The request object containing update data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const updateUserDetails = async (req, res) => {
    try {
        const user = await userService.updateUserDetails(req.params.userId, req.body);

        // Example: Notify an external service about the user update
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/user-updated`, {
            userId: user.userId,
            updates: req.body,
        });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Deletes a user account.
 * Handles the HTTP request to delete a user account.
 * 
 * @param {Object} req - The request object containing userId as a parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {void}
 */
const deleteUserAccount = async (req, res) => {
    try {
        await userService.deleteUserAccount(req.params.userId);

        // Notify an external service after a user is deleted
        await axios.post(`${EXTERNAL_SERVICE_URL}/api/user-deleted`, {
            userId: req.params.userId,
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserDetails,
    deleteUserAccount,
};

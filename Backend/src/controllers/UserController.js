// src/controllers/userController.js

require('dotenv').config();

const axios = require('axios'); // Importing axios for making HTTP requests
const userService = require('../services/UserService'); // Importing the user service
const lolaSerivce = require('../services/LolaService');
const jwt = require('jsonwebtoken')

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
        const lola = await lolaSerivce.createLolaSession(user._id);

        // Notify an external service that a new user has been registered (e.g., sending a welcome email)
        // await axios.post(`${EXTERNAL_SERVICE_URL}/api/user-registered`, {
        //     userId: user.userId,
        //     email: user.emailId,
        //     name: user.name,
        // });

        res.status(201).json({ success: true, message: 'User registered successfully', user, lola});
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
    // console.log("process env JWT SECRET in Login", process.env.JWT_SECRET);
    try {
        // const user = await userService.authenticateUser(req.body.emailId, req.body.password);
        const { user  } = await userService.authenticateUser(req.body.emailId, req.body.password);
        const lolaSession = await lolaSerivce.createLolaSession(user._id, new Date());

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });



        // Example: Fetch user-related data from an external API after successful login
        // const externalData = await axios.get(`${EXTERNAL_SERVICE_URL}/api/user-data/${user.userId}`);
        
        res.status(200).json({ success: true, token, user, lolaSession, message: 'Login successful', user });
        // res.status(200).json({ success: true, token, user,  message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).json({ error: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            throw new Error('User not authenticated');
        }

        // res.status(100).json({ message: `${req.user}`});
        await lolaSerivce.endLolaSession(req.user.id);

        console.log('req.user in UserController: ', req.user);
        const result = await userService.logoutUser(req.user.id);

        res.status(200).json({ success: true, message: 'Logout successful'});
    } catch (error) {
        console.error(`Error during logout: ${error.message}`);
        console.log('req.user in UserController: ', req.user.id);
        res.status(400).json({ error: error.message });
    }
} ;

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

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.findUserById(userId);

        if (!user) {
            return res.status(404).json({ sucess: false, message: 'User not found!' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user profile:', error) ;
        res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
    }
};

const updateUserProfile = async (req, res) =>  {
    try {
        const userId = req.user.id
        const profileData = req.body;
        console.log('userId from controller: ', userId);
        console.log('Profile data received:', profileData); // Debug log


        const updatedUser = await userService.updateUserProfile(userId, profileData);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found!!' });
        } 

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};



module.exports = {
    registerUser,
    loginUser,
    updateUserDetails,
    deleteUserAccount,
    getUserProfile,
    updateUserProfile,
    logoutUser,
};

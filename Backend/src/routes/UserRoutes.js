// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/UserController');
const authenticateToken = require('../auth/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, userController.getUserProfile);

router.put('/update-profile', authenticateToken, userController.updateUserProfile);

// Route to register a new user
router.post('/register', userController.registerUser);

// Route to login a user
router.post('/login', userController.loginUser);

// Route to update user details
router.put('/:userId', authenticateToken, userController.updateUserDetails);

// Route to delete a user account
router.delete('/:userId', authenticateToken, userController.deleteUserAccount);

module.exports = router;

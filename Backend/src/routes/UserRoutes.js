// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

// Route to register a new user
router.post('/register', userController.registerUser);

// Route to login a user
router.post('/login', userController.loginUser);

// Route to update user details
router.put('/:userId', userController.updateUserDetails);

// Route to delete a user account
router.delete('/:userId', userController.deleteUserAccount);

module.exports = router;

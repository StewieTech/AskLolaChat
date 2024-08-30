require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const connectDB = require('../src/config/Db'); // MongoDB connection
const { verifyGoogleToken } = require('./auth/oauth'); // Google OAuth logic
// const passport = require('./auth/passport'); // Passport configuration
const userRoutes = require('./routes/userRoutes');
const lolaRoutes = require('./routes/lolaRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { listImagesFromDirectory } = require('./utils/fileUtils'); // Image listing utility

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Passport.js
// app.use(passport.initialize());

// Connect to the database
connectDB();

// Google OAuth2 login route
app.post('/googlelogin', async (req, res) => {
    try {
        const { tokenId } = req.body;
        const userData = await verifyGoogleToken(tokenId);

        // You can add logic to find or create a user in your database here

        res.json({ message: 'Login success!', user: userData });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Login failed due to server error' });
    }
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/lola', lolaRoutes);
app.use('/api/messages', messageRoutes);

// Image listing routes
app.get('/api/images/headerMain', async (req, res) => {
    try {
        const images = await listImagesFromDirectory('headerMain');
        res.json(images);
    } catch (error) {
        console.error('Error in /api/images/headerMain:', error);
        res.status(500).send(error);
    }
});

// http://localhost:3001/api/images/headerMain

app.get('/api/images/Yoga', async (req, res) => {
    try {
        const images = await listImagesFromDirectory('Yoga');
        res.json(images);
    } catch (error) {
        console.error('Error in /api/images/Yoga:', error);
        res.status(500).send(error);
    }
});

// Root route
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Hey Yall World');
});

// Static files (if applicable)
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

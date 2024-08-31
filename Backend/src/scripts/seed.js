// scripts/seed.js
const mongoose = require('mongoose');
const User = require('../models/UserModel');
const Lola = require('../models/LolaModel');
const Message = require('../models/MessageModel');

require('dotenv').config(); // Load environment variables

const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userLolaDB";

const seedDatabase = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Lola.deleteMany({});
        await Message.deleteMany({});

        // Create a sample user
        const user = new User({
            userId: 'user123',
            emailId: 'testuser@example.com',
            gender: 'Male',
            emailVerified: true,
            password: 'hashedpassword123', // You should hash the password in real scenarios
            name: 'Test User',
            subscriptionType: 'premium',
            preferences: { theme: 'dark', language: 'en' },
        });

        await user.save();
        console.log('Sample User Created:', user);

        // Create a sample Lola session
        const lolaSession = new Lola({
            lolaId: 'lola123',
            userId: user._id,
            relationshipLevel: 3,
            interactionCount: 5,
            sentimentAnalysis: 'positive'
        });

        await lolaSession.save();
        console.log('Sample Lola Session Created:', lolaSession);

        // Create sample messages
        const messageToLola = new Message({
            lolaId: lolaSession._id,
            userId: user._id,
            messageType: 'toLola',
            content: 'Hi Lola, how are you?',
            sentimentAnalysis: 'neutral'
        });

        await messageToLola.save();
        console.log('Sample Message to Lola Created:', messageToLola);

        const messageFromLola = new Message({
            lolaId: lolaSession._id,
            userId: user._id,
            messageType: 'fromLola',
            content: 'I am doing great, thanks for asking!',
            sentimentAnalysis: 'positive'
        });

        await messageFromLola.save();
        console.log('Sample Message from Lola Created:', messageFromLola);

        // Update the Lola session with message references
        lolaSession.messagesToLola.push(messageToLola._id);
        lolaSession.messagesFromLola.push(messageFromLola._id);
        await lolaSession.save();

        console.log('Lola Session Updated with Messages:', lolaSession);

        mongoose.disconnect();
        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();

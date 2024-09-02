// models/userModel.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    lolaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lola' }, // Link to Lola model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User model
    messageType: { type: String, enum: ['fromLola', 'toLola'] }, // Indicates whether the message is from Lola or the user
    content: String, // The actual message text
    question: String, // The actual message text
    lolaResponse: String, // The actual message text
    timestamp: { type: Date, default: Date.now }, // Time when the message was sent
    sentimentAnalysis: String, // Optionally store sentiment analysis results here
});




module.exports = mongoose.model('Message', MessageSchema);

// models/userModel.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionId: String, // Unique identifier for the session
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User model
    lolaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lola' }, // Link to Lola model
    startedAt: { type: Date, default: Date.now }, // Session start time
    endedAt: Date, // Session end time
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages within the session
    duration: Number, // Duration of the session in seconds
    feedback: String, // User's feedback after the session
});




module.exports = mongoose.model('Session', SessionSchema);

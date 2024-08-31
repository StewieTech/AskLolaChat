// models/userModel.js
const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User model
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, // Link to Session model
    eventType: String, // e.g., 'messageSent', 'sessionStarted', 'sessionEnded'
    eventTimestamp: { type: Date, default: Date.now }, // Timestamp of the event
    details: Map, // Additional details, e.g., message content, duration, etc.
});



module.exports = mongoose.model('Analytics', AnalyticsSchema);

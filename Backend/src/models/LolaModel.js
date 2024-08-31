// models/userModel.js
const mongoose = require('mongoose');

const LolaSchema = new mongoose.Schema({
    lolaId: String, // Unique identifier for Lola's session or relationship to the user
    messagesFromLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages from Lola
    messagesToLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages to Lola
    relationshipLevel: Number, // A numeric value representing the relationship depth
    sessionStart: { type: Date, default: Date.now }, // Start time of the interaction session
    sessionEnd: Date, // End time of the interaction session
    interactionCount: { type: Number, default: 0 }, // Number of interactions
    sentimentAnalysis: String, // Optionally store sentiment analysis results here});
})



module.exports = mongoose.model('Lola', LolaSchema);

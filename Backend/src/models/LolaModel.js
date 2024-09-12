// models/lolaModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const LolaSchema = new mongoose.Schema({
    sessionId: { type: Number, unique: true }, // Auto-incremented session primary key
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    lolaId: { type: Number, unique: true }, // Auto-incremented primary key
    messagesFromLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages from Lola
    messagesToLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages to Lola
    relationshipLevel: Number, // A numeric value representing the relationship depth
    sessionStart: { type: Date, default: Date.now }, // Start time of the interaction session
    sessionEnd: Date, // End time of the interaction session
    interactionCount: { type: Number, default: 0 }, // Number of interactions
    sentimentAnalysis: String, 
    sessionQuestionCountRemaining: {type: Number, default: 1},
    maxQuestionLimit: { type: Number, default: 1},
});

LolaSchema.plugin(AutoIncrement, { inc_field: 'sessionId' });
LolaSchema.plugin(AutoIncrement, { inc_field: 'lolaId', start_seq: 1000 });


module.exports = mongoose.model('Lola', LolaSchema);

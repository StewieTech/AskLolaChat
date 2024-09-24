// models/lolaModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const LolaSchema = new mongoose.Schema({
    sessionId: { type: Number  }, // Auto-incremented session primary key
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    // userId: { type: Number, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lolaId: { type: Number  },
    messagesFromLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages from Lola
    messagesToLola: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Array of messages to Lola
    relationshipLevel: Number, // A numeric value representing the relationship depth
    sessionStart: { type: Date, default: Date.now }, // Start time of the interaction session
    sessionEnd: { type: Date, default: null}, // End time of the interaction session
    interactionCount: { type: Number, default: 0 }, // Number of interactions
    sentimentAnalysis: String, 
    sessionQuestionCountRemaining: {type: Number, default: 2},
    maxQuestionLimit: { type: Number, default: 4},
});

LolaSchema.plugin(AutoIncrement, {id: 'session_seq', inc_field: 'sessionId', reference_fields: ['userId'] });

// LolaSchema.plugin(AutoIncrement, { inc_field: 'lolaId' });

// Pre-save hook to assign lolaId only when a new user registers
LolaSchema.pre('save', async function(next) {
    if (this.isNew) {
        if (!this.lolaId) {
            const existingLola = await this.constructor.findOne({ userId: this.userId });
            if (existingLola) {
                this.lolaId = existingLola.lolaId;
            } else {
                const lastLola = await this.constructor.findOne().sort('-lolaId');
                this.lolaId = lastLola ? lastLola.lolaId + 1 : 1;
            }
        }
    }
    next();
});


module.exports = mongoose.model('Lola', LolaSchema);

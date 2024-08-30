// models/userModel.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User model
    type: String, // e.g., 'free', 'pro', 'premium'
    startDate: { type: Date, default: Date.now }, // Subscription start date
    endDate: Date, // Subscription end date
    isActive: { type: Boolean, default: true }, // Whether the subscription is currently active
    paymentDetails: {
        method: String, // e.g., 'credit card', 'paypal'
        lastPaid: Date, // Last payment date
        nextPaymentDue: Date, // Next payment due date
    },
});



module.exports = mongoose.model('Lola', LolaSchema);

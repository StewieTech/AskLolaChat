// models/userModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // This will be auto-incremented
    emailId: String, // User email
    gender: String, // Gender of the user
    googleId: String,
    oauthProvider: String,
    lolaId: String, // Relationship to Lola session or user
    emailVerified: Boolean, // Email verification status
    password: String, // Encrypted password
    name: String, // User's name
    createdOn: { type: Date, default: Date.now }, // Account creation date
    lastLogin: Date, // Last login timestamp
    subscriptionType: String, // e.g., 'free', 'premium'
    isActive: { type: Boolean, default: true }, // Account active status
    preferences: { type: Map, of: String }, // Store user preferences as key-value pairs
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });



module.exports = mongoose.model('User', UserSchema);

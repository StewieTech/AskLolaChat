// models/userModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // This will be auto-incremented
    emailId: { type: String, required: true, unique: true }, // User email
    lolaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lola' }, // Link to Lola model    
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        default: 'Male' 
    }, // Gender of the user
    googleId: { type: String },
    oauthProvider: { type: String },
    emailVerified: { type: Boolean, default: false }, // Email verification status
    password: { type: String, required: true }, // Encrypted password
    name: { type: String, required: true }, // User's name
    createdOn: { type: Date, default: Date.now }, // Account creation date
    lastLogin: { type: Date }, // Last login timestamp
    subscriptionType: { 
        type: String, 
        enum: ['Free', 'Premium'], 
        default: 'Free' 
    }, // e.g., 'free', 'premium'
    isActive: { type: Boolean, default: true }, // Account active status
    preferences: { type: Map, of: String }, // Store user preferences as key-value pairs
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });



module.exports = mongoose.model('User', UserSchema);

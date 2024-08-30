// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// const connectionString = "mongodb://localhost:27017/userLolaDB"
const connectionString = "mongodb://127.0.0.1:27017/userLolaDB";

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
        // await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

require('dotenv').config();
// import GoogleStrategy from 'passport-google-oauth2';

const mongoose = require('mongoose');

// Passport
const session = require('express-session');
const passport = require("passport");

/*
 I want to create a connection to my database using mongoose and connect to the database called userLolaDB. 
I want to be able to write to the database and read from it.
*/



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err=> {
    console.log('Error connecting to MongoDB: ', err);
});



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    googleId: String,
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
// auth/authMiddleware.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();

// const authenticate = (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user) => {
//         if (err || !user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         req.user = user;
//         next();
//     })(req, res, next);
// };


const authenticateToken = async (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        
        // console.log('User object:', user);
        const userId = user._id || user.id || user.userId;
        // console.log("User ID used in JWT:", userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found', decoded});
        }
        req.user = user; // You can access the user's data in other routes now
        next();
    } catch (error) {
        console.error('Authentication error: ', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authenticateToken;



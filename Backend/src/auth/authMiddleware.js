// auth/authMiddleware.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
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


const authenticateToken = (req, res, next) => {
    // const token = req.header('Authorization').replace('Bearer ', '');
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming the token is passed as a Bearer token


    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // You can access the user's data in other routes now
        console.log("this is req.user inside authenticateToken: ", req.user)
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authenticateToken;



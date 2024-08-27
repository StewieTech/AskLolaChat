const express = require('express')
const router = express.Router();
const db = require('../db/serverPG');
const bcrypt = require('bcrypt') ;
const saltRounds = 10;
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.static("public"));   

router.use(session({
    secret: "itsAnSecret",
    resave: false,
    saveUninitialized: true,
})
);

router.use(passport.initialize());
router.use(passport.session());






router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"

}));



router.get('/login', (req, res) => {
    res.send("Hey login world")
});

router.get('/dashboard', (req, res) => {
    console.log("This is user: ", req.user);
   if (req.isAuthenticated()) {
         res.send('Welcome to the dashboard');
   } else {
    isRedirect('/')
         res.send('You must log in first');
   }
})

passport.use(new LocalStrategy(async function verify(username, password, cb) { 
    console.log(username);
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",
            [username,

            ]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log(result.rows[0]);
                const storedHashedPassword = user.password;
                bcrypt.compare(password, storedHashedPassword, (err, result) => {
                    if (err) {
                        console.log("Passwords don't compare: ", err);
                        return cb(err);
                    } else {
                        if (result) {
                            console.log(result)
                            res.status(200).json({ message: 'Login was successful!!'});
                            return cb(null, user);
                        } else {
                            res.send("User was not found");
                            return cb("NO USER!!")
                        }
                    }
                })
            }

    } catch (err) {
        console.error('Error during login', err);
        res.status(500).json({ message: "Login has failed"});
        return cb(err);
    }

}))

module.exports = router;
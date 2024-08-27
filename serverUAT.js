// An express server, which will handle api requests coming in
// import { Configuration, OpenAIApi } from "openai";
require('dotenv').config();
const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
const secrets = require('./secrets');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');




const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3001;

// I want to create a connection to my database using mongoose and connect to the database called userLolaDB. I want to be able to write to the database and read from it.

app.use(session({
    secret: 'Secret baby', // string I chose the name of
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }))

app.use(passport.initialize());
app.use(passport.session());


// mongoose.connect("mongodb://localhost:27017/superTest");
// mongoose.connect("mongodb://localhost:27017/userLolaDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://127.0.0.1:27017/userLolaDB");

// mongoose.set("useCreateIndex,", true);


const userSchema = new mongoose.Schema({

    email: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(findOrCreate)

// const User = new mongoose.model("User", userSchema);

// Testing
const User = mongoose.model("User", userSchema);

const user = new User ({
    email: "test12538@gmail.com",
    password: "test1233",
    googleId: "test33"
})

// user.save();
// User.insertMany([User])
    
//     , function(err){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfullly saved to database")
//     }
// })

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
})

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/register", function(req,res) {
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res, function() {
                res.redirect("/secrets");
            })
        }
    })
});

app.get('/', (req, res) => {
    res.send('Hey Yall World')
});


app.post("/login", function(req,res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req,res, function() {
                res.redirect("/secrets");
            })
        }
    })
});

// Add this route to handle registration
app.post("/register", function(req, res) {
    const { email, password } = req.body;
  
    // Create a new user with email and password
    const newUser = new User({ email });
  
    User.register(newUser, password, function(err, user) {
      if (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
      } else {
        passport.authenticate("local")(req, res, function() {
          res.status(200).json({ message: 'Registration successful' });
        });
      }
    });
  });
  

app.post("/login", function(req, res) {
    if (err) {
        console.log(err);
    } else {
        passport.authenticate("local")(req,res, function(){
            res.redirect("/secrets");
        })
    }
})

app.get("/logout", function (req,res) {
    req.logout();
    res.redirect("/");
});





const configuration = new Configuration({
    // organization: "YOUR_ORG_ID",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {

    const {message} = req.body ;
    const contentAnswer = secrets.contentAnswer ;
      
    //   Person: $`{message} `?`
    
    const response = await openai.createChatCompletaion({
        
        
        "model": "gpt-3.5-turbo",
        messages: [
            {role: "system", content: contentAnswer},
            {role: "user", content: message},
        ],
     
        "max_tokens": 40,
        "temperature": 0
    });
//   console.log(response.data)
 var answer = response["data"]["choices"][0]["message"]["content"]
  console.log(answer);
  if(answer) {
        res.json({
            message: answer
        });
    }
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


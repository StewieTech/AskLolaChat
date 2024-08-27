const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL', err);
    return;
  }
  console.log('Connected to MySQL');
});

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'Secret baby',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;

const UserSchema = {
  username: {
    type: 'VARCHAR(255)',
    unique: true,
    allowNull: false
  },
  password: {
    type: 'VARCHAR(255)',
    allowNull: false
  },
  googleId: {
    type: 'VARCHAR(255)',
    unique: true,
    allowNull: true
  }
};

const createUserTable = () => {
  connection.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, googleId VARCHAR(255) UNIQUE)');
};

createUserTable();

passport.use(new GoogleStrategy({
  clientID: secrets.google.clientID,
  clientSecret: secrets.google.clientSecret,
  callbackURL: 'http://localhost:3001/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
  const { id, displayName } = profile;
  connection.query('SELECT * FROM users WHERE googleId = ?', [id], (err, results) => {
    if (err) {
      console.error('Error querying database', err);
      return cb(err);
    }
    if (results.length > 0) {
      return cb(null, results[0]);
    }
    const user = { username: displayName, googleId: id };
    connection.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('Error inserting user', err);
        return cb(err);
      }
      user.id = result.insertId;
      return cb(null, user);
    });
  });
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error querying database', err);
      return cb(err);
    }
    if (results.length > 0) {
      return cb(null, results[0]);
    }
    return cb(null, null);
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password', err);
      return res.status(500).send('Internal server error');
    }

    const user = { username, password: hash };
    connection.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('Error inserting user', err);
        return res.status(500).send('Internal server error');
      }
      console.log('User inserted successfully');
      res.redirect('/login');
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying database', err);
      return res.status(500).send('Internal server error');
    }
    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords', err);
        return res.status(500).send('Internal server error');
      }
      if (!result) {
        return res.status(401).send('Invalid username or password');
      }
      req.login(user, (err) => {
        if (err) {
          console.error('Error logging in user', err);
          return res.status(500).send('Internal server error');
        }
        res.redirect('/');
      });
    });
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.username}!`);
  } else {
    res.send('Hello, world!');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// src/app.js
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user'); // Import your User model
const Password = require('./models/password'); // Import Mongoose model
const db = require('./db'); // Import MongoDB connection
const authRouter = require('./auth'); // Example router file
const passwordRouter = require('./passwords');
const app = express();
const dotenv = require("dotenv");
const config = require('./config');
const { API_URL, KEY } = require('./config');
const { AJAX } = require('./ajax');
const generatePassword = require('./passwordGenerator');
const logparser = require('./logparser');
const loggenerator = require('./loggenerator');
const authenticate = require('./authenticate');
const portfinder = require('portfinder');
const LogEntry = require('./models/LogEntry');

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection successfully!"))
.catch((err) => console.log(err));

//CORS
const corsoptions = {
  origin: "http://localhost:5000" || "*", //The frontend domain. || or
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials",
  ],
};

app.use(cors(corsoptions));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Browser Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/password', (req, res) => {
  res.sendFile(path.join(__dirname, 'Password.html'));
});

app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'Sign-up.html'));
});

app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign-in.html'));
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/passwords', passwordRouter);
app.use('/api/authenticate', authenticateRouter);
app.use('/api/loggenerator', loggeneratorRouter);
app.use('/api/logparser', logparserRouter);

// Set base port to 3000 or read from environment
portfinder.basePort = process.env.PORT || 3001;

// Find a free port and start the server
portfinder.getPort((err, port) => {
  if (err) {
    console.error('Error finding a free port:', err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost: ${port}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

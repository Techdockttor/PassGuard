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
const portfinder = require('portfinder');
const { createNginxConfig } = require('./nginxConfig'); // Import the utility function

dotenv.config();

//CORS
const corsoptions = {
  origin: "http://0.0.0.0:5001" || "*", //The frontend domain. || or
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

// New route for creating Nginx config
app.post('/create-nginx-config', (req, res) => {
    const { domain, publicFolder } = req.body;

    createNginxConfig(domain, publicFolder, (error, message) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message });
    });
});

// Get host and debug mode from environment variables or use defaults
const host = process.env.PASSGUARD_HOST || '0.0.0.0';
const debug = process.env.PASSGUARD_DEBUG ? process.env.PASSGUARD_DEBUG.toLowerCase() === 'true' : true;

// Find an available port using portfinder
portfinder.getPort({ port: process.env.PASSGUARD_PORT || 5001 }, (err, port) => {
  if (err) {
    console.error('Error finding available port:', err);
    process.exit(1);
  }

  // Start the Express app
  app.listen(port, '0.0.0.0', () => { // using 0.0.0.0 for external access
    console.log(`Server is running on http://${host}:${port}(Press CTRL+C to quit)`);
    console.log('Starting server...'); // Adding the console.log statement here
  });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/passguarddb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

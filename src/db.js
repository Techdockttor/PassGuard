// src/db.js
const mongoURI = 'mongodb://localhost:27017/passguarddb';
const mongoose = require('mongoose');

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

mongoose.connect('mongodb://localhost:27017/passguarddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handlers for MongoDB connection
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
  // Perform operations that require a database connection here
});

// Export the database connection
module.exports = db;

// src/db.js

const mongoose = require('mongoose');

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

mongoose.connect('mongodb://localhost:27017/passguarddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

// src/db.js
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/passguarddb'; 
require('dotenv').config();

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

const mongoURI = process.env.MONGODB_URI;

console.log('MongoURI:', mongoURI); // Debug statement
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

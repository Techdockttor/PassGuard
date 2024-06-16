const mongoose = require('mongoose');
require('dotenv').config();

// Load MongoDB URI from environment variables or use a fallback
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/passguarddb';

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

// Set mongoose options and connect to MongoDB
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

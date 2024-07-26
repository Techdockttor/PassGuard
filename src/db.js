const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true);

// Enable Mongoose debugging
mongoose.set('debug', true);

// Function to retrieve MongoDB URI from environment variables or use default
function getMongoURI() {
  const defaultURI = 'mongodb://localhost:27017/passguarddb';
  return process.env.MONGODB_URI || defaultURI;
}

// Usage example:
const mongoURI = getMongoURI();
console.log('MongoURI:', mongoURI);

// Set mongoose options and connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Added unified topology for better server discovery and monitoring
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('MongoDB connection is open');
});

module.exports = db;

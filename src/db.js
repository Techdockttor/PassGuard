const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

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
  console.log('Connected to MongoDB'); // Moved successful connection message here
}).catch(err => {
  console.error('MongoDB connection error:', err); // Moved error handling here
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Removed duplicate success message to avoid redundancy
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

module.exports = db;

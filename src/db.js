const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Set strictQuery to suppress the warning
mongoose.set('strictQuery', true); // or false based on your preference

// Access the MongoDB URI from the environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/passguarddb';

if (!mongoURI) {
  console.error('Error: MONGODB_URI is not defined in the environment variables.');
  process.exit(1); // Exit the process with an error code
}

console.log('MongoURI:', mongoURI); // Debug statement to check the URI

// Set mongoose options and connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

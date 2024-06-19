// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Adjust the path as per your project structure
const LogEntry = require('./models/LogEntry'); // Adjust the path as per your project structure

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is passed in the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user; // Attach user object to request object for further use
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;

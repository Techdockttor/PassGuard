// src/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Password = require('./models/password');

// Endpoint to retrieve and view username
router.get('/fullname', (req, res) => {
    const { username } = req.query; // Extract username from query parameters
    // Return the username in the response
    res.json({ username });
});

// Endpoint to retrieve and view email
router.get('/emailAddress', (req, res) => {
  const { email } = req.query; // Extract email from query parameters
  // Return the email in the response
  res.json({ email });
});

// Endpoint to retrieve and view generatedPassword
router.get('/activePasscode', (req, res) => {
  const { generatedPassword } = req.query; // Extract generatedPassword from query parameters
  // Return the email in the response
  res.json({ generatedPassword });
});


// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and return JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if old password is correct
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Update the password
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate password
router.post('/passwords', async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;

    // Generate a password
    const generatedPassword = generatePassword();

    const newPassword = new Password({
      title,
      description,
      start_date,
      end_date,
      generatedPassword
    });

    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve all password entries
router.get('/passwords', async (req, res) => {
  try {
    const passwords = await Password.find();
    res.status(200).json(passwords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/passwords - Fetch all passwords or filter by status
router.get('/passwords', async (req, res) => {
  try {
      let query = {};
      const { status } = req.query;
      if (status && status !== 'All') {
          query = { status };
      }

      const passwords = await Password.find(query);
      res.json(passwords);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Delete password
router.delete('/delete-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const password = await Password.findById(id);
    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }
    await password.remove();
    res.status(200).json({ message: 'Password deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to authenticate user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.authenticate(username, password, (err, token) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (token) {
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Route to logout user
router.post('/logout', (req, res) => {
  const { token } = req.body;

  User.logout(token, (err, success) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (success) {
      return res.status(200).json({ message: 'Logout successful' });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });
});

module.exports = router;

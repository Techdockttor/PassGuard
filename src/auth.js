// src/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Password = require('./models/password');
const generatePassword = require('../passwordGenerator');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
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

// Route to generate a new password
router.get('/generate', async (req, res) => {
    try {
        const password = await generatePassword();
        res.status(200).json({ password });
    } catch (error) {
        console.error('Error generating password:', error);
        res.status(500).json({ error: 'Failed to generate password' });
    }
});

module.exports = router;

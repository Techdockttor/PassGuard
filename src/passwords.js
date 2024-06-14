// src/routes/passwords.js
const express = require('express');
const router = express.Router();
const Password = require('./models/password');

// Create a new password
router.post('/', async (req, res) => {
  try {
    const { password, expiresAt } = req.body;
    const newPassword = await Password.create({ password, expiresAt });
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all passwords
router.get('/', async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a password
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.json({ message: 'Password deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update password status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const password = await Password.findById(id);
    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }
    password.status = status;
    await password.save();
    res.json(password);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

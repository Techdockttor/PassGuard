// src/models/password.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for Password model
const passwordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},
  start_date: {
    type: Date,
    default: Date.now,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
  },
  generatedPassword: {
    type: String,
    required: true
}
});

// Create and export model
module.exports = mongoose.model('Password', passwordSchema);
module.exports = Password;
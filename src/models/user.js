// src/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoURI = 'mongodb://localhost:27017/passguard';
const { API_URL, KEY } = require('../config.js');
const { AJAX } = require('../ajax.js');

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


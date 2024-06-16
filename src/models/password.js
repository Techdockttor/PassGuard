// password.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { API_URL, KEY } = require('../config.js');
const { AJAX } = require('../ajax.js');

const passwordSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    generatedPassword: { type: String, required: true }, 
	status: { type: String, enum: ['active', 'expired'], default: 'active'}
});

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
;

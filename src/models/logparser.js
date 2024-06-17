const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  request: {
    type: String,
    required: true,
  },
  statusCode: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('LogEntry', logEntrySchema);

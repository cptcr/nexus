const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

module.exports = Transcript;
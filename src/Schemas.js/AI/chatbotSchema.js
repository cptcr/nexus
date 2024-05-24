const mongoose = require('mongoose');

const ChatBotChannel = new mongoose.Schema({
  guildId: String,
  channelId: String,
});

module.exports = mongoose.model('chatbotchannels', ChatBotChannel);

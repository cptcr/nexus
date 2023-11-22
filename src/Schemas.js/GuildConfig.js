const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: String,
  inboxChannelId: String,
  outboxChannelId: String,
  inboxRoleId: String,
  outboxRoleId: String,
  userId: String,
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);

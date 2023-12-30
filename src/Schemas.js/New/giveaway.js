const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    endTime: Date,
    prize: String,
    winnersCount: Number,
    participants: [String], 
    id: String,
    ended: Boolean,
});

module.exports = mongoose.model('Giveaway', giveawaySchema);

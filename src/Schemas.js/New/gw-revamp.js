const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    prize: String,
    duration: Date,
    hostId: String,
    embedBanner: String,
    embedColor: String,
    winners: Number,
    guildId: String,
    channelId: String,
    messageId: String, // The message ID of the giveaway message
    participants: [String] // Array of user IDs who participated
});

const Giveaway = mongoose.model('Giveaway', giveawaySchema);

module.exports = Giveaway;

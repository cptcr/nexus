// Transcript Schema (transcript/list.js)
const mongoose = require('mongoose');

const EmbedFieldSchema = new mongoose.Schema({
    name: String,
    value: String,
    inline: Boolean
});

const EmbedSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    timestamp: Date,
    color: Number,
    footer: {
        text: String,
        iconURL: String
    },
    image: {
        url: String
    },
    thumbnail: {
        url: String
    },
    author: {
        name: String,
        iconURL: String,
        url: String
    },
    fields: [EmbedFieldSchema]
});

const MessageSchema = new mongoose.Schema({
    messageId: String,
    authorId: String,
    authorTag: String,
    content: String,
    timestamp: Date,
    embeds: [EmbedSchema]
});

const transcriptSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Transcript = mongoose.model('Transcript', transcriptSchema);
module.exports = Transcript;

const { model, Schema } = require("mongoose");

const voteSchema = new Schema({
    userID: String,
    pollID: String,
    option: Number
});

const pollSchema = new Schema({
    guildID: String,
    messageID: String,
    channelID: String,
    title: String,
    description: String,
    options: [String],
    duration: Number,
    image: String,
    votes: [voteSchema]
});

const Poll = model('Poll', pollSchema);
const Vote = model('Vote', voteSchema);

module.exports = { Poll, Vote };

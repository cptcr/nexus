const {model, Schema} = require("mongoose");

let userVoted = new Schema({
    User: String,
    Message: String,
    Guild: String,
});

module.exports = model("PollVotes", userVoted);
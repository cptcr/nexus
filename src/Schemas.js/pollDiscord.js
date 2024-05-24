const { model, Schema } = require("mongoose");

const schema = new Schema({
    Guild: String,
    Author: String,
    Channel: String,
    Message: String,
    isAdmin: Boolean,
    Question: String,
    Answers: Array,
    Duration: String,
    AllowMultiSelect: Boolean
})

module.exports = model("discord_polls", schema);
const {model, Schema } = require("mongoose");

let schema = new Schema({
    Moderator: String,
    Guild: String,
    Action: String,
    Reason: String,
    Date: String,
    ID: String,
});

module.exports = model("log_actions", schema);
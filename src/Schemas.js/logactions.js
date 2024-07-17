const {model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    Data: Array,
    User: String,
    Moderator: String,
    Time: String,
    Type: String,
    Code: String
});

module.exports = model("log_actions", schema);
const {model, Schema} = require("mongoose");

let schema = new Schema({
    Guild: String,
    CustomID: String,
    MessageID: String,
    RoleID: String,
    ChannelID: String,
});

module.exports = model("react-test", schema)
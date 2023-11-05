const {model, Schema} = require("mongoose");

let schema = new Schema({
    Channel: String,
    Guild: String,
    Message: String,
    ID: String,
    Host: String,
    Title: String,
    Details: String,
    DM: Boolean,
    Image: String,
    Mention: String,
    Winners: Number,
    Duration: String,
    WinRole: String,
    Users: Array,
    Winnsers: Array,
    Conent: String,
});

module.exports = model("gw-dyno", schema)
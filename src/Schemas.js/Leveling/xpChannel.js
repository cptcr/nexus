const { model, Schema } = require("mongoose");

let xp_channel = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model("xp_channel", xp_channel)
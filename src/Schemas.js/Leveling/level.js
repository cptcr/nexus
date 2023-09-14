const { model, Schema } = require("mongoose");

let levelSchema = new Schema({
    Guild: String,
    User: String,
    XP: Number,
    Level: Number,
    barTrackColor: String,
    barColor: String,
    rankColor: String,
    levelColor: String,
});

module.exports = model("level", levelSchema);
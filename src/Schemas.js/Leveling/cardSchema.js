const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    User: String,
    barTrackColor: String,
    barColor: String,
    rankColor: String,
    levelColor: String,
});

module.exports = model("card", schema)
const { model, Schema } = require("mongoose");

let streamSchema = new Schema({
    Guild: String,
    Monday: String,
    Tuesday: String,
    Wednesday: String,
    Thursday: String,
    Friday: String,
    Saturday: String,
    Sunday: String,
    Platform: String,
    Streamer: String,
});

module.exports = model('streamSchema', streamSchema);
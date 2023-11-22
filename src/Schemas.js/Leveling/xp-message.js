const { model, Schema } = require("mongoose");

let schema = new Schema({
    XP: Number,
    Guild: String,
})

module.exports = model("xp_message", schema)
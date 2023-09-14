const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    Role: String,
    Level: Number,
});

module.exports = model("xp-role", schema)
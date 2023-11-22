const {model, Schema} = require("mongoose");

let schema = new Schema({
    Guild: String,
});

module.exports = model("warn_panel", schema);
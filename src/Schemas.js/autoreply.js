const {model, Schema} = require("mongoose");

let schema = new Schema({
    Guild: String,
    Keyword: String,
    Reply: String
});

module.exports = model("autoreply", schema);
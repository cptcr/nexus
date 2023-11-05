const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    Role: String,
});

module.exports = model("verify", schema)
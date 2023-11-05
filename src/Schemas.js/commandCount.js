const { model, Schema } = require("mongoose");

let schema = new Schema({
    CC: Number,
    ID: String,
})

module.exports = model("command_count", schema);
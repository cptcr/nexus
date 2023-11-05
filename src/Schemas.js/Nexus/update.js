const { model, Schema } = require("mongoose");

let schema = new Schema({
    Version: String,
    Description: String,
});

module.exports = model("nexus", schema);
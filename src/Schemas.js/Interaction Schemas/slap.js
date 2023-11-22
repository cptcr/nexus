const { model, Schema} = require("mongoose");

let slapSchema = new Schema({
    User: String,
    Count: Number
});

module.exports = model("slap", slapSchema);
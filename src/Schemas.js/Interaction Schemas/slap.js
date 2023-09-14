const { model, Schema} = require("mongoose");

let slapSchema = new Schema({
    User: String,
    Count: String
});

module.exports = model("slap", slapSchema);
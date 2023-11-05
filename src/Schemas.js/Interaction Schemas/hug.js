const { model, Schema} = require("mongoose");

let hugSchema = new Schema({
    User: String,
    Count: Number
});

module.exports = model("hug", hugSchema);
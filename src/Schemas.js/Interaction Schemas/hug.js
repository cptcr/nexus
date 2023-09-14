const { model, Schema} = require("mongoose");

let hugSchema = new Schema({
    User: String,
    Count: String
});

module.exports = model("hug", hugSchema);
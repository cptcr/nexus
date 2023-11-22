const { model, Schema} = require("mongoose");

let kissSchema = new Schema({
    User: String,
    Count: Number
});

module.exports = model("bite", kissSchema);
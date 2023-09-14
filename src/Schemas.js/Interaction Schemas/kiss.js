const { model, Schema} = require("mongoose");

let kissSchema = new Schema({
    User: String,
    Count: String
});

module.exports = model("kiss", kissSchema);
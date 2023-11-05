const {model, Schema } = require("mongoose");

let schema = new Schema({
    Account: String,
    Message: String,
    Channel: String, 
    Guild: String,
});

module.exports = model("youtube", schema)
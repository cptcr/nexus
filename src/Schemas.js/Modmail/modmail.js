const { model, Schema } = require("mongoose");

let modmail = new Schema({
    Guild: String,
    Category: String
});

module.exports = model("modmail", modmail);
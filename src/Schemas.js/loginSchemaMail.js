const {model, Schema} = require("mongoose");

let logMail = new Schema({
    User: String,
    Message: String,
    Guild: String,
});
 
module.exports = model("logMail", logMail);
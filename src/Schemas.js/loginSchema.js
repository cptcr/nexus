const {model, Schema} = require("mongoose");

let logSchema = new Schema({
    Channel: String,
    Guild: String,
});
 
module.exports = model("logSchema", logSchema);
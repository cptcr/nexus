const { model, Schema } = require("mongoose");
 
let numSchema = new Schema({
    Guild: String,
    User: String,
    Number: Number
});
 
module.exports = model("ghostNum", numSchema);
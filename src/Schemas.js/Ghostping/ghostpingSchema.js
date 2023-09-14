const { model, Schema } = require("mongoose");
 
let ghostSchema = new Schema({
    Guild: String,
});
 
module.exports = model("ghost", ghostSchema);
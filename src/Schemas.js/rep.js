const {model, Schema} = require('mongoose');
 
let reportSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    Role: String
});
 
module.exports = model("report", reportSchema);
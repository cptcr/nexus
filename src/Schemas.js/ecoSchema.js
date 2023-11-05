const { model, Schema } = require("mongoose");
 
let ecoSchema = new Schema({
    Guild: String,
    User: String,
    Bank: Number,
    Wallet: Number
});
 
module.exports = model("ecoSchema", ecoSchema);
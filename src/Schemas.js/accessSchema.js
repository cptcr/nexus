const{ model, Schema } = require("mongoose");

let acc = new Schema({
   Guild: String,
   Numb: Number,
});

module.exports = model("acc", acc);
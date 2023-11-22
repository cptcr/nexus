const { model, Schema} = require("mongoose");

let punchSchema = new Schema({
    User: String,
    Count: Number
});

module.exports = model("punch", punchSchema);
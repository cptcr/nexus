const { model, Schema} = require("mongoose");

let punchSchema = new Schema({
    User: String,
    Count: String
});

module.exports = model("punch", punchSchema);
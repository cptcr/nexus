const{ model, Schema } = require("mongoose");

let capSchema = new Schema({
    Guild: String,
    Role: String,
    Captcha: String,
});

module.exports = model("cap", capSchema);
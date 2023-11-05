const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model("audit_log", schema);
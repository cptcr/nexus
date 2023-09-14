const { model, Schema } = require("mongoose");

const schema = new Schema({
    Role: String,
    Guild: String,
    Message: String,
    Channel: String,
});

module.exports = model("reactionrole", schema)
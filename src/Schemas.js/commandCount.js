const { model, Schema } = require("mongoose");

let schema = {
    Count: Number,
}

module.exports = model("command_count", schema);
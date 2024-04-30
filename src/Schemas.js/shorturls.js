const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    Redirect: String,
    Code: String,
});

module.exports = mongoose.model("shorted-urls", schema);
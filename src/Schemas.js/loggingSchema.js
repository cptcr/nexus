const { model, Schema } = require("mongoose");

let log = new Schema({
    User: String
});

module.exports = model('log', log);
const { model, Schema } = require('mongoose');

let blacklist = new Schema({
    User: String,
    Reason: String,
    Moderator: String,
});

module.exports = model('blacklist', blacklist);
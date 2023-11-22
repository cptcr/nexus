const { model, Schema } = require('mongoose');

let blacklistserver = new Schema({
    Guild: String,
    Reason: String,
    Moderator: String,
})

module.exports = model('blacklistserver', blacklistserver);
const { model, Schema } = require('mongoose');

let modmailuses = new Schema({
    User: String,
    Guild: String,
    Channel: String
});

module.exports = model('modmailuses', modmailuses);
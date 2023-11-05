const { model, Schema } = require('mongoose');

let welcome = new Schema({
    Guild: String,
    Channel: String,
    Reaction: String
})

module.exports = model('welcomeSchema', welcome);
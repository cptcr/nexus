const { model, Schema } = require ('mongoose');

let jointocreate = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number
})

module.exports = model('jointocreate', jointocreate);
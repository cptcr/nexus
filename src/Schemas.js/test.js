const { model, Schema } = require('mongoose');

let testSchema = new Schema({
    GuildID: String,
    UserID: String
})

module.exports = model('testSchema', testSchema);
const { model, Schema } = require ('mongoose');

let jointocreatechannels = new Schema({
    Guild: String,
    User: String,
    Channel: String
})

module.exports = model('jointocreatechannels', jointocreatechannels);
const { model, Schema } = require('mongoose');

let afkSchema = new Schema ({
    User: String,
    Guild: String,
    Message: String,
    Nickname: String
})

module.exports = model('afkschema', afkSchema);
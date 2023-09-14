const { model, Schema} = require("mongoose");

let servertemplates = new Schema({
    GuildIcon: String,
    GuildBanner: String,
    GuildName: String,
    Channels: Array,
    Roles: Array,
    Emojis: Array,
    ID: String,
    Stickers: Array,
    Categories: Array
})

module.exports = model("servertemplates", servertemplates);
const {client} = require("../../../index");
const {Events} = require("discord.js");
const theme = require("../../../../embedConfig.json");
client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith("?bon")) {
    return await message.reply({
      content: `${message.mentions.first} has been banned from ${message.guild.name}`
    })
  }
})
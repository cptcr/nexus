//Autoreply
const {client} = require("../../../index");
const {Events} = require("discord.js");
const theme = require("../../../../embedConfig.json");
client.on(Events.MessageCreate, async (message) => {
    const autoreply = require("../../../Schemas.js/autoreply");
  
    if (message.author.bot) return;
    if (!message.author.member) return;
    
    const replyData = await autoreply.find({
      Guild: message.guild.id,
    })
  
    if (!replyData) return;
  
    for (const data of replyData) {
      const lower = data.Keyword.toLowerCase()
      if (message.content.toLowerCase().includes(lower)) {
        await message.reply(data.Reply)
      }
    }
  })
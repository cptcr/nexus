const { EmbedBuilder, Events } = require('discord.js');
const theme = require("../../../embedConfig.json");

module.exports = async (client) => {
  
    //autoreply
    client.on(Events.MessageCreate, async (message) => {
      const autoreply = require("../../Schemas.js/autoreply");
    
      // Ignore messages from bots
      if (message.author.bot) return;

      // Check if the message author is a member of the guild
      if (!message.member) return;
      
      // Fetch autoreply data for the guild
      const replyData = await autoreply.find({
        Guild: message.guild.id,
      });

      // If no autoreply data found, return
      if (!replyData) return;
    
      // Check each autoreply data for a keyword match
      for (const data of replyData) {
        const lower = data.Keyword.toLowerCase();
        if (message.content.toLowerCase().includes(lower)) {
          await message.reply(data.Reply);
        }
      }
    });
};

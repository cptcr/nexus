const { EmbedBuilder, Events } = require('discord.js')
const theme = require("../../../embedConfig.json");
const blacklistserver = require('../../Schemas.js/Blacklist/blacklistserver');

module.exports = async (client) => {
  
    //blacklist server
    client.on(Events.InteractionCreate, async guild => {
      const data = await blacklistserver.findOne({ Guild: guild.id });
    
      if(!data) {
        return;
      } else {
        await guild.leave();
      }
    })
    const SchemaB = require("../../Schemas.js/Blacklist/blacklist");
  
    //Ban part
    if (member.guild.id !== process.env.MAINGUILDID) {
      return;
    } else {
      //get data
      const dataB = await SchemaB.findOne({ User: member.user.id });
  
      //if data
      if (dataB) {
        //reason
        const reasonB = dataB.Reason;
        //ban
        await member.guild.members.ban(member, {reasonB}).catch(err => {
          return;
        });
        //send msg
        await member.send({
          content: `You have been banned from our bot and support server! | Reason: ${reasonB}.`
        });
      } else {
        return;
      }
    }
}
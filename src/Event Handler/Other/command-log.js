const { EmbedBuilder, Events } = require('discord.js')
const theme = require("../../../embedConfig.json");
const logSchema = require("../../Schemas.js/loggingSchema");

module.exports = async (client) => {
  
    //command logging
    client.on(Events.InteractionCreate, async interaction => {
      try {
        if(!interaction) return;
        if(!interaction.isChatInputCommand()) return;
        else {
        const channel = await client.channels.cache.get(process.env.CMDLOG);
        const server = interaction.guild.name;
        const userId = interaction.user.id;
        const data = await logSchema.findOne({ User: interaction.user.id});
      
        const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle(`⚠️ Chat Command Used!`)
        .addFields({ name: `Server Name`, value: `${server}`})
        .addFields({ name: `Chat Command`, value: `${interaction.commandName}`})
        .addFields({ name: `User`, value: `<@${userId}>`})
        .addFields({ name: `Channel`, value: `${interaction.channel.id}`})
        .addFields({ name: `Link:`, value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`})
        .setTimestamp()
        .setFooter({ text: `Chat Command Executed`})
        
        if (!data) {
          try {
              await channel.send({ embeds: [embed] });
          } catch (error) {
              return;
          }
        } else {
            console.log(`Command has been used! Command: \n${interaction}`)
        }
        
        
        }

      } catch (error) {
        return;
      }
    })
}
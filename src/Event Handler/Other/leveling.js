const { EmbedBuilder, Events } = require('discord.js')
const theme = require("../../../embedConfig.json");
const levelSchema = require("../../Schemas.js/Leveling/level");
const levelChannel = require("../../Schemas.js/Leveling/xpChannel");
const levelDisable = require("../../Schemas.js/Panel/Systems/xp");
const levelRole = require("../../Schemas.js/Leveling/xp-roles");
const levelAmount = require("../../Schemas.js/Leveling/xp-message")

module.exports = async (client) => {
  
    client.on(Events.MessageCreate, async (message) => {
      if (message.guild) {
          const disData = await levelDisable.findOne({ Guild: message.guild.id });
          if (disData) return;
      }
      
      const { guild, author } = message;
    
      if (!guild || author.bot) return;
    
      levelSchema.findOne({
          Guild: guild.id,
          User: author.id
      }, async (err, data) => {
    
          if (err) throw err;
    
          if (!data) {
              levelSchema.create({
                  Guild: guild.id,
                  User: author.id,
                  XP: 0,
                  Level: 0
              })
          }
      })
    
      let amount;
      const dataAmount = await levelAmount.findOne({
          Guild: message.guild.id,
      });
    
      if (dataAmount) {
          amount = dataAmount.XP
      } else {
          amount = 5
      }
    
      const dataChannel = await levelChannel.findOne({ Guild: message.guild.id });
    
      const give = amount;
    
      const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});
    
      if (!data) return;
    
      const requiredXP = data.Level * data.Level * 10 * 10;
    
      if (data.XP + give >= requiredXP) {
          data.XP += give;
          data.Level +=1;
          await data.save();
    
          const roleData = await levelRole.findOne({
              Level: data.Level,
              Guild: message.guild.id
          })
    
          if (roleData) {
              const targetMember = message.member;
              const role = message.guild.roles.cache.get(roleData.Role)
              if (role) {
                  await targetMember.roles.add(role).catch(err => {console.log(err)});
              }
          }
    
          const embed = new EmbedBuilder()
          .setColor(theme.theme)
          .setDescription(`${author} you have reached **Level ${data.Level}**!`)
          .addFields(
              {name: "XP:", value: `${data.XP}`, inline: true},
              {name: "Level:", value: `${data.Level}`, inline: true}
          )
          .setFooter({ text: "Requested by YellowBebo"})
          .setTimestamp()
          .setThumbnail(author.displayAvatarURL())
    
          if (dataChannel) {
              const i = await client.channels.cache.get(`${dataChannel.Channel}`);
              await i.send({ embeds: [embed], content: `<@${message.author.id}>`, ephemeral: true }).catch(err => {return;});
          } else if (!dataChannel) {
              await message.reply({ embeds: [embed] }).then(msg => {
                  setTimeout(() => msg.delete(), 5000)
              });
          }
      } else {
          data.XP += give;
          data.save();
      }
    })
}
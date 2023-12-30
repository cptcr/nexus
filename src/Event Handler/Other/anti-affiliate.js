const { EmbedBuilder, Events } = require('discord.js')
const linkSchema = require('../../Schemas.js/linkSchema');

module.exports = async (client) => {
  
    //anti affiliate
    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id === null) {
            return
        }
     
      if (message.content.includes('http') || message.content.includes('discord.gg') || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg/') || message.content.includes('dsc.gg')) {
    
          const Data = await linkSchema.findOne({ Guild: message.guild.id}).catch(err => {
              return;
          });
    
          if (!Data) return;
    
          const memberPerms = Data.Perms;
    
          const user = message.author;
          const member = message.guild.members.cache.get(user.id);
    
          if (member.permissions.has(memberPerms)) return;
          else {
              await message.channel.send({ content: `${message.author}, you can't send links here!`}).then(msg => {
                  setTimeout(() => msg.delete(), 3000)
              })
    
              ;(await message).delete();
          }
      }
    })
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    try {
      if (newMessage.content.includes('http') || newMessage.content.includes('discord.gg') || newMessage.content.includes('https://') || newMessage.content.includes('http://') || newMessage.content.includes('discord.gg/') || newMessage.content.includes('dsc.gg')) {
        const Data = await linkSchema.findOne({ Guild: oldMessage.guild.id}).catch(err => {
            return;
        });
    
        if (!Data) return;
    
        const memberPerms = Data.Perms;
    
        const user = oldMessage.author;
        const member = oldMessage.guild.members.cache.get(user.id);
    
        if (member.permissions.has(memberPerms)) return;
        else {
            await message.channel.send({ content: `${message.author}, you can't send links here!`}).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            })
    
            ;(await message).delete();
        }
    }
    } catch (err) {
      return;
    }
    
    })
}
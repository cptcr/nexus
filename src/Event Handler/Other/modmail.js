const { EmbedBuilder, Events } = require('discord.js')
const theme = require("../../../embedConfig.json");
const moduses = require("../../Schemas.js//Modmail/modmailuses");
const modschema = require("../../Schemas.js/Modmail/modmail");
module.exports = async (client) => {
    //modmail
    client.on(Events.MessageCreate, async message => {
    
      if (message.guild) return;
      if (message.author.id === client.user.id) return;
      if (!message.author.user) return;
      
      const usesdata = await moduses.findOne({ User: message.author.id });
    
      if (!usesdata) {
    
          message.react('👋')
    
          const modselect = new EmbedBuilder()
          .setColor(theme.theme)
          .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
          .setAuthor({ name: `📞 Modmail System`})
          .setFooter({ text: `📞 Modmail Selecion`})
          .setTimestamp()
          .setTitle('> Select a Server')
          .addFields({ name: `• Select a Modmail`, value: `> Please submit the Server's ID you are \n> trying to connect to in the modal displayed when \n> pressing the button bellow!`})
          .addFields({ name: `• How do I get the server's ID?`, value: `> To get the Server's ID you will have to enable \n> Developer Mode through the Discord settings, then \n> you can get the Server's ID by right \n> clicking the Server's icon and pressing "Copy Server ID".`})
    
          const button = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setCustomId('selectmodmail')
              .setLabel('• Select your Server')
              .setStyle(ButtonStyle.Secondary)
          )     
    
          const msg = await message.reply({ embeds: [modselect], components: [button] });
          const selectcollector = msg.createMessageComponentCollector();
    
          selectcollector.on('collect', async i => {
    
              if (i.customId === 'selectmodmail') {
    
                  const selectmodal = new ModalBuilder()
                  .setTitle('• Modmail Selector')
                  .setCustomId('selectmodmailmodal')
    
                  const serverid = new TextInputBuilder()
                  .setCustomId('modalserver')
                  .setRequired(true)
                  .setLabel('• What server do you want to connect to?')
                  .setPlaceholder('Example: "1078641070180675665"')
                  .setStyle(TextInputStyle.Short);
    
                  const subject = new TextInputBuilder()
                  .setCustomId('subject')
                  .setRequired(true)
                  .setLabel(`• What's the reason for contacting us?`)
                  .setPlaceholder(`Example: "I wanted to bake some cookies, but toowake didn't let me!!!"`)
                  .setStyle(TextInputStyle.Paragraph);
    
                  const serveridrow = new ActionRowBuilder().addComponents(serverid)
                  const subjectrow = new ActionRowBuilder().addComponents(subject)
    
                  selectmodal.addComponents(serveridrow, subjectrow)
    
                  i.showModal(selectmodal)
    
              }
          })
    
      } else {
    
          if (message.author.bot) return;
    
          const sendchannel = await client.channels.cache.get(usesdata.Channel);
          if (!sendchannel) {
    
              message.react('⚠')
              await message.reply('**Oops!** Your **modmail** seems **corrupted**, we have **closed** it for you.')
              return await moduses.deleteMany({ User: usesdata.User });
    
          } else {
    
              const msgembed = new EmbedBuilder()
              .setColor(theme.theme)
              .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
              .setFooter({ text: `📞 Modmail Message - ${message.author.id}`})
              .setTimestamp()
              .setDescription(`${message.content || `**No message provided.**`}`)
    
              if (message.attachments.size > 0) {
    
                  try {
                      msgembed.setImage(`${message.attachments.first()?.url}`);
                  } catch (err) {
                      return message.react('❌')
                  }
    
              }
    
              const user = await sendchannel.guild.members.cache.get(usesdata.User)
              if (!user) {
                  message.react('⚠️')
                  message.reply(`⚠️ You have left **${sendchannel.guild.name}**, your **modmail** was **closed**!`)
                  sendchannel.send(`⚠️ <@${message.author.id}> left, this **modmail** has been **closed**.`)
                  return await moduses.deleteMany({ User: usesdata.User })
              }
    
              try {
    
                  await sendchannel.send({ embeds: [msgembed] });
    
              } catch (err) {
                  return message.react('❌')
              }
              
              message.react('📧')
          }
      }
    })
    
    client.on(Events.InteractionCreate, async interaction => {
    
      if (!interaction.isModalSubmit()) return;
    
      if (interaction.customId === 'selectmodmailmodal') {
    
          const data = await moduses.findOne({ User: interaction.user.id });
          if (data) return await interaction.reply({ content: `You have **already** opened a **modmail**! \n> Do **/modmail close** to close it.`, ephemeral: true });
          else {
    
              const serverid = interaction.fields.getTextInputValue('modalserver');
              const subject = interaction.fields.getTextInputValue('subject');
    
              const server = await client.guilds.cache.get(serverid);
              if (!server) return await interaction.reply({ content: `**Oops!** It seems like that **server** does not **exist**, or I am **not** in it!`, ephemeral: true });
              
              const executor = await server.members.cache.get(interaction.user.id);
              if (!executor) return await interaction.reply({ content: `You **must** be a member of **${server.name}** in order to **open** a **modmail** there!`, ephemeral: true});
    
              const modmaildata = await modschema.findOne({ Guild: server.id });
              if (!modmaildata) return await interaction.reply({ content: `Specified server has their **modmail** system **disabled**!`, ephemeral: true});
              
              const channel = await server.channels.create({
                  name: `modmail-${interaction.user.id}`,
                  parent: modmaildata.Category,
    
              }).catch(err => {
                  return interaction.reply({ content: `I **couldn't** create your **modmail** in **${server.name}**!`, ephemeral: true});
              })
      
              await channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });
    
              const embed = new EmbedBuilder()
              .setColor(theme.theme)
              .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
              .setAuthor({ name: `📞 Modmail System`})
              .setFooter({ text: `📞 Modmail Opened`})
              .setTimestamp()
              .setTitle(`> ${interaction.user.username}'s Modmail`)
              .addFields({ name: `• Subject`, value: `> ${subject}`})
    
              const buttons = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                  .setCustomId('deletemodmail')
                  .setEmoji('❌')
                  .setLabel('Delete')
                  .setStyle(ButtonStyle.Secondary),
    
                  new ButtonBuilder()
                  .setCustomId('closemodmail')
                  .setEmoji('🔒')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Secondary)
              )
          
              await moduses.create({
                  Guild: server.id,
                  User: interaction.user.id,
                  Channel: channel.id
              })
              
              await interaction.reply({ content: `Your **modmail** has been opened in **${server.name}**!`, ephemeral: true});
              const channelmsg = await channel.send({ embeds: [embed], components: [buttons] });
              channelmsg.createMessageComponentCollector();
    
          }
      }
    })
    
    client.on(Events.InteractionCreate, async interaction => {
    
      if (interaction.customId === 'deletemodmail') {
    
          const closeembed = new EmbedBuilder()
          .setColor("White")
          .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
          .setAuthor({ name: `📞 Modmail System`})
          .setFooter({ text: `📞 Modmail Closed`})
          .setTimestamp()
          .setTitle('> Your modmail was Closed')
          .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})
    
          const delchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
          const userdata = await moduses.findOne({ Channel: delchannel.id });
    
          await delchannel.send('❌ **Deleting** this **modmail**..')
    
          setTimeout(async () => {
    
              if (userdata) {
    
                  const executor = await interaction.guild.members.cache.get(userdata.User)
                  if (executor) {
                      await executor.send({ embeds: [closeembed] });
                      await moduses.deleteMany({ User: userdata.User });
                  }
    
              }
    
              try {
                  await delchannel.delete();
              } catch (err) {
                  return;
              }
              
          }, 100)
    
      }
    
      if (interaction.customId === 'closemodmail') {
    
          const closeembed = new EmbedBuilder()
          .setColor(theme.theme)
          .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
          .setAuthor({ name: `📞 Modmail System`})
          .setFooter({ text: `📞 Modmail Closed`})
          .setTimestamp()
          .setTitle('> Your modmail was Closed')
          .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})
    
          const clchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
          const userdata = await moduses.findOne({ Channel: clchannel.id });
    
          if (!userdata) return await interaction.reply({ content: `🔒 You have **already** closed this **modmail**.`, ephemeral: true})
    
          await interaction.reply('🔒 **Closing** this **modmail**..')
    
          setTimeout(async () => {
              
              const executor = await interaction.guild.members.cache.get(userdata.User)
              if (executor) {
    
                  try {
                      await executor.send({ embeds: [closeembed] });
                  } catch (err) {
                      return;
                  }
                  
              }
    
              interaction.editReply(`🔒 **Closed!** <@${userdata.User}> can **no longer** view this **modmail**, but you can!`)
    
              await moduses.deleteMany({ User: userdata.User });
    
          }, 100)
    
      }
    })
    
    client.on(Events.MessageCreate, async message => {
    
      if (message.author.bot) return;
      if (!message.guild) return;
    
      const data = await modschema.findOne({ Guild: message.guild.id });
      if (!data) return;
    
      const sendchanneldata = await moduses.findOne({ Channel: message.channel.id });
      if (!sendchanneldata) return;
    
      const sendchannel = await message.guild.channels.cache.get(sendchanneldata.Channel);
      const member = await message.guild.members.cache.get(sendchanneldata.User);
      if (!member) return await message.reply(`⚠ <@${sendchanneldata.User} is **not** in your **server**!`)
    
      const msgembed = new EmbedBuilder()
      .setColor(theme.theme)
      .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
      .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
      .setFooter({ text: `📞 Modmail Received - ${message.author.id}`})
      .setTimestamp()
      .setDescription(`${message.content || `**No message provided.**`}`)
    
      if (message.attachments.size > 0) {
    
          try {
              msgembed.setImage(`${message.attachments.first()?.url}`);
          } catch (err) {
              return message.react('❌')
          }
    
      }
    
      try {
          await member.send({ embeds: [msgembed] });
      } catch (err) {
          message.reply(`⚠ I **couldn't** message **<@${sendchanneldata.User}>**!`)
          return message.react('❌')
      }
      message.react('📧')
    })
    
}
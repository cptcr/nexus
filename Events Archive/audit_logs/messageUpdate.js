const Audit_Log = require("../../../Schemas.js/auditlog");
const {client} = require("../../../index");
const {Events, EmbedBuilder, ButtonBuilder} = require("discord.js");
const theme = require("../../../../embedConfig.json");
/*const { id, channel_id, guild_id, author, timestamp, type } = data;*/
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  console.log("test")
    if (oldMessage.content === newMessage.content) return;
    const data = await Audit_Log.findOne({
      Guild: oldMessage.guild.id
    })
    let logID;
    if (data) {
      logID = data.Channel
    } else {
      return;
    }
    const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    const id = oldMessage.id;
    const guildID = oldMessage.guild.id;
    const channelID = oldMessage.channel.id;
    const buttons = new ButtonBuilder()
    .setLabel("Jump to")
    .setStyle(ButtonStyle.Link)
    .setURL(`https://canary.discord.com/channels/${guildID}/${channelID}/${id}`);
    const row = new ActionRowBuilder().addComponents(buttons);
    const newText = newMessage.content;
    const oldText = oldMessage.content;
    const length1 = newMessage.length;
    const length2 = oldMessage.length;
    if (length1 >= 1024 && length2 >= 1024) {
      const LongAuditEmbed = new EmbedBuilder()
      .setTitle("Message Edited")
      .addFields({ name: 'Author:', value: `${newMessage.author.tag}`, inline: false})
      .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
      .setColor(theme.theme)
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      const embedOld = new EmbedBuilder()
      .setTitle("Old Message")
      .setDescription(`${oldText}`)
      .setColor(theme.theme)
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      const embedNew = new EmbedBuilder()
      .setTitle("New Message")
      .setDescription(`${newText}`)
      .setColor(theme.theme)
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      await auditChannel.send({ embeds: [LongAuditEmbed, embedOld, embedNew], components: [row]});
    }
    auditEmbed.setTitle("Message Edited")
    .addFields({ name: 'Author:', value: `${newMessage.author.tag}`, inline: false})
    .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
    .addFields({ name: 'Old Message:', value: `${oldMessage.content}`, inline: false})
    .addFields({ name: 'New Message:', value: `${newMessage.content}`, inline: false})
    await auditChannel.send({ embeds: [auditEmbed], components: [row]}).catch((err) => {return;});
})
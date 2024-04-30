const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Remove all reactions from a message
    client.on(Events.MessageReactionRemoveEmoji, async (reaction) => {
      perm(reaction);
        const {message} = reaction;
        const {author, id, guild, channel } = message
      
        const data = await Audit_Log.findOne({
          Guild: guild.id
        })
        let logID;
        if (data) {
          logID = data.Channel
        } else {
          return;
        }
      
        const discords = [
          "discord.com",
          "ptb.discord.com",
          "canary.discord.com"
        ];
        const num = Math.floor(Math.random(discords.length))
        const output = `https://${discords[num]}/channels/${guild.id}/${channel.id}/${id}`
        const button = new ButtonBuilder()
        .setLabel("Jump to")
        .setDisabled(false)
        .setStyle(ButtonStyle.Link)
        .setURL(output)
      
        const row = new ActionRowBuilder()
        .addComponents(button)
      
        const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
      
        auditEmbed.addFields(
          {name: "Author:", value: `${author}`, inline: false},
          {name: "Message ID:", value: `${id}`, inline: false},
          {name: "Channel:", value: `${channel}`, inline: false},
          {name: "Channel ID:", value: `${channel.id}`, inline: false},
          {name: "Channel Name:", value: `${channel.name}`, inline: false},
          {name: "Link:", value: output, inline: false}
        ).setTitle("Message Reaction Remove Emoji")
        await auditChannel.send({
          embeds: [auditEmbed],
          components: [row]
        })
    })

}
const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Thread Delete
    client.on(Events.ThreadDelete, async (thread) => {
        perm(thread);
      const data = await Audit_Log.findOne({
          Guild: thread.guild.id,
      })
      let logID;
      if (data) {
          logID = data.Channel
      } else {
          return;
      }
      const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
      const auditChannel = client.channels.cache.get(logID);
    
      auditEmbed.setTitle("Thread Deleted").addFields(
          {name: "Name:", value: thread.name, inline: false},
          {name: "Tag:", value: `<#${thread.id}>`, inline: false},
          {name: "ID:", value: thread.id, inline: false},
      )
      await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}
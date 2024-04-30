const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Channel Update
    client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
        perm(oldChannel);
        if (oldChannel.parentId === "1167049272265547796" || newChannel.parentId === "1167049272265547796") {
            return;
        }

        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const data = await Audit_Log.findOne({
            Guild: oldChannel.guild.id,
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditChannel = client.channels.cache.get(logID);
        const changes = [];
        if (oldChannel.name !== newChannel.name) {
            changes.push(`Name: \`${oldChannel.name}\` → \`${newChannel.name}\``);
          }
          if (oldChannel.topic !== newChannel.topic) {
            changes.push(`Topic: \`${oldChannel.topic || 'None'}\` → \`${newChannel.topic || 'None'}\``);
          }
          if (changes.length === 0) return; 
          const changesText = changes.join('\n');
        auditEmbed.setTitle("Channel Updated").addFields({ name: "Changes:", value: changesText})
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}
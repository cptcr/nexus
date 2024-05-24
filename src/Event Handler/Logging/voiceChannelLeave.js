const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        perm(oldState);
        if (oldState.channel && !newState.channel) {
            const data = await Audit_Log.findOne({
                Guild: oldState.guild.id
            })
            let logID;
            if (data) {
                logID = data.Channel
            } else {
                return;
            }

            const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
            const auditChannel = client.channels.cache.get(logID);
            auditEmbed.setTitle("Voice Channel Left")
            .addFields(
                {name: "Channel:", value: `${newState.channel}`, inline: false},
                {name: "Member:", value: `${oldState.member}`, inline: false},
                {name: "Member ID:", value: `${oldState.member.id}`}
            )
            .setThumbnail(`${oldState.member.displayAvatarURL()}`)
            await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
        }
    })

}
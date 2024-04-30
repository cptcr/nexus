const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        perm(oldMember);
        // Check for timeout application (not just an update of the existing timeout)
        if (!oldMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp) {
            const duration = newMember.communicationDisabledUntilTimestamp - Date.now();
            // Use AuditLogEvent instead of a string to ensure we're using the correct event
            const fetchedLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberUpdate });
            const firstEntry = fetchedLogs.entries.first();

            // Ensure theme.theme actually exists; otherwise, set a default color
            const auditEmbed = new EmbedBuilder()
                .setColor(theme.theme ? theme.theme : '#FFFFFF') // Fallback color if theme.theme is not defined
                .setTitle('Member Timed Out')
                .addFields(
                    { name: 'User ID', value: newMember.user.id, inline: true },
                    { name: "User:", value: `${newMember}` },
                    { name: 'Timeout Duration', value: `${Math.round(duration / 60000)} minutes`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Nexus Audit Log System' });

            const data = await Audit_Log.findOne({ Guild: newMember.guild.id });
            if (!data) return;

            const auditChannel = await client.channels.fetch(data.Timeout).catch(() => null);
            if (auditChannel) {
                await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
            }
        }
    });
};
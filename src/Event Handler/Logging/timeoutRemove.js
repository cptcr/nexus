const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        perm(oldMember);
        if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
            // Fetch audit logs for MEMBER_UPDATE actions
            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberUpdate,
            });


            
            // Assuming the first entry is the relevant one since we're fetching the latest
            const timeoutRemovalLog = fetchedLogs.entries.first();
            let executor = 'Unknown'; // Default value in case we can't find the log
            if (timeoutRemovalLog) {
                executor = timeoutRemovalLog.executor.tag;
            }

            const auditEmbed = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle('Timeout Removed')
                .setDescription(`Member: ${newMember.user.tag}\nRemoved by: ${executor}`)
                .setTimestamp()
                .setFooter({ text: 'Nexus Audit Log System' });

            const data = await Audit_Log.findOne({ Guild: newMember.guild.id });
            if (!data) return;

            const auditChannel = await client.channels.fetch(data.Untimeout).catch(() => null);
            if (auditChannel) {
                await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
            }
        }
    });
};

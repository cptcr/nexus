const { EmbedBuilder, Events } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
            const fetchedLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_UPDATE' });
            const firstEntry = fetchedLogs.entries.first();

            const auditEmbed = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle('Member Timed Out')
                .setDescription(`Member: ${newMember.user.tag}\nDuration: ${newMember.communicationDisabledUntil}\nModerator: ${firstEntry.executor.tag}\nReason: ${firstEntry.reason}`)
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

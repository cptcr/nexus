const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

//WORKING

module.exports = async (client) => {
    client.on(Events.GuildBanAdd, async (ban) => {
        // Fetch the latest ban entry from the audit logs
        const auditLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.BanAdd,
            limit: 1
        }).catch(console.error);

        const banLog = auditLogs?.entries.first();

        // Ensure that the audit log is for the correct user
        if (!banLog || banLog.target.id !== ban.user.id) return;

        // Extracting the ban reason
        const reason = banLog.reason || 'No reason provided';

        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Member Banned')
            .setDescription(`User: ${ban.user}\n UserID: \`${ban.user.id}\`\nReason: ${reason}`)
            .setAuthor({
                name: `${ban.user.id}`,
                iconURL: `${ban.user.displayAvatarURL()}`
            })
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        const data = await Audit_Log.findOne({ Guild: ban.guild.id });
        if (!data) return;

        const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
        if (auditChannel) {
            await auditChannel.send({ embeds: [auditEmbed] }).catch(console.error);
        }
    });
};



//im not gonna do this by myself lol
const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);

module.exports = async (client) => {
    client.on(Events.GuildBanAdd, async (ban) => {
        // Fetch the guild's audit logs for the ban event
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        });
        const banLog = fetchedLogs.entries.first();

        // Determine the moderator, fallback to 'Unknown' if not found
        const moderator = banLog ? banLog.executor.tag : 'Unknown';

        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Member Banned')
            .setDescription(`Member: ${ban.user.tag}\nReason: ${ban.reason || 'No reason provided'}\nModerator: ${moderator}`)
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        const data = await Audit_Log.findOne({ Guild: ban.guild.id });
        if (!data) return;

        const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
        if (auditChannel) {
            await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
        }

        await log_actions.create({
            Moderator: moderator,
            Action: "BAN_MEMBER",
            Guild: ban.guild.id,
            Reason: ban.reason || 'No reason provided',
            ID: token
        });
    });
};

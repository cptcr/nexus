const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.on(Events.GuildMemberRemove, async (member) => {
        try {
            console.log(`GuildMemberRemove event triggered for ${member.user.tag}`);

            // Wait a bit to allow audit logs to update (optional, adjust as needed)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const auditLogs = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.Kick,
                limit: 1
            });

            const kickLog = auditLogs.entries.first();

            if (kickLog) {
                console.log(`Kick log found for ${kickLog.target.id}`);

                if (kickLog.target.id === member.user.id) {
                    const reason = kickLog.reason || 'No reason provided';

                    const auditEmbed = new EmbedBuilder()
                        .setColor(theme.theme)
                        .setTitle('Member Kicked')
                        .setDescription(`Member: ${member.user.tag}\nReason: ${reason}`)
                        .setTimestamp()
                        .setFooter({ text: 'Nexus Audit Log System' });

                    const data = await Audit_Log.findOne({ Guild: member.guild.id });
                    if (!data) return;

                    const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
                    if (auditChannel) {
                        await auditChannel.send({ embeds: [auditEmbed] }).catch(console.error);
                    }
                } else {
                    console.log(`No kick log matches the member who left: ${member.user.tag}`);
                }
            } else {
                console.log('No recent kick logs found');
            }
        } catch (error) {
            console.error('Error in GuildMemberRemove event:', error);
        }
    });
};


const { EmbedBuilder } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.logMemberKick = async (guild, member, reason) => {
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Member Kicked')
            .setDescription(`Member: ${member.user.tag}\nReason: ${reason || 'No reason provided'}`)
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        const data = await Audit_Log.findOne({ Guild: guild.id });
        if (!data || !data.Kick) return;

        const auditChannel = await client.channels.fetch(data.Kick).catch(() => null);
        if (auditChannel) {
            await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
        }
    };
};

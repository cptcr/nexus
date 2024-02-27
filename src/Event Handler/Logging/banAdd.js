const { EmbedBuilder, Events } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.on(Events.GuildBanAdd, async (ban) => {
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Member Banned')
            .setDescription(`Member: ${ban.user.tag}\nReason: ${ban.reason || 'No reason provided'}`)
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        const data = await Audit_Log.findOne({ Guild: ban.guild.id });
        if (!data) return;

        const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
        if (auditChannel) {
            await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
        }
    });
};

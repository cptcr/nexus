const { EmbedBuilder, Events } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.on(Events.EmojiCreate, async (emoji) => {
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle('Emoji Created')
            .setDescription(`Emoji: ${emoji.toString()} (Name: ${emoji.name})`)
            .setTimestamp()
            .setFooter({ text: 'Nexus Audit Log System' });

        const data = await Audit_Log.findOne({ Guild: emoji.guild.id });
        if (!data) return;

        const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
        if (auditChannel) {
            await auditChannel.send({ embeds: [auditEmbed] }).catch(() => {});
        }
    });
};

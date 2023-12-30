const { EmbedBuilder, Events } = require('discord.js');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

//WORKING

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        let description = '';
        let title = 'Member Update';

        // Check for role changes
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;
        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (addedRoles.size > 0 || removedRoles.size > 0) {
            title = 'Member Roles Updated';
            description += addedRoles.size > 0 ? `**Roles Added**: ${addedRoles.map(r => r).join(', ')}\n` : '';
            description += removedRoles.size > 0 ? `**Roles Removed**: ${removedRoles.map(r => r).join(', ')}\n` : '';
        }

        // Check for nickname change
        if (oldMember.nickname !== newMember.nickname) {
            title = 'Member Nickname Updated';
            description += `**Old Nickname**:   \`${oldMember.nickname || 'None'}\` \n**New Nickname**: \`${newMember.nickname || 'None'}\`\n`;
        }

        // Check for avatar change
        if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
            title = 'Member Avatar Updated';
            description += '**Avatar Updated**\n';
        }

        // Send message if there was a change
        if (description) {
            const auditEmbed = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle(title)
                .setDescription(description)
                .setTimestamp()
                .setFooter({ text: 'Nexus Audit Log System' });

            const data = await Audit_Log.findOne({ Guild: newMember.guild.id });
            if (!data) return;

            const auditChannel = await client.channels.fetch(data.Channel).catch(() => null);
            if (auditChannel) {
                await auditChannel.send({ embeds: [auditEmbed] }).catch(console.error);
            }
        }
    });
};

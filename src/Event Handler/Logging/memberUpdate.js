const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTimestamp()
            .setFooter({ text: "Nexus Audit Log System" });

        const data = await Audit_Log.findOne({ Guild: oldMember.guild.id });
        let logID = data ? data.Member : null;
        if (!logID) return;

        const auditChannel = client.channels.cache.get(logID);
        const changes = [];

        if (oldMember.nickname !== newMember.nickname) {
            changes.push(`Nickname: \`${oldMember.nickname || 'None'}\` → \`${newMember.nickname || 'None'}\``);
        }

        if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
            const oldRoles = oldMember.roles.cache.map(r => r).join(", ");
            const newRoles = newMember.roles.cache.map(r => r).join(", ");
            changes.push(`Roles: \`${oldRoles}\` → \`${newRoles}\``);
        }

        if (changes.length === 0) return;
        const changesText = changes.join('\n');

        auditEmbed
            .setTitle("Member Updated")
            .addFields({ name: "Changes:", value: changesText });

        await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {});
    });
};

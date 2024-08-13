const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    //Channel Create
    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        perm(oldMember);
        const addedRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id));

        if (!addedRole) return;

        const data = await Audit_Log.findOne({
            Guild: oldMember.guild.id
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed.setTitle("Member Role Added").addFields(
            { name: 'Member:', value: `<@${newMember.id}>`, inline: true },
            { name: 'Member ID:', value: newMember.id, inline: true },
            { name: 'Role:', value: `<@&${addedRole.id}>`, inline: true },
            { name: 'Role ID:', value: addedRole.id, inline: true },
        )
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    });
}
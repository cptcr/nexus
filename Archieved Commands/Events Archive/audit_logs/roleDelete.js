const Audit_Log = require("../../../src/Schemas.js/auditlog");
const {client} = require("../../../src/index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");
//Role Delete
client.on(Events.GuildRoleDelete, async (role) => {
    const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const data = await Audit_Log.findOne({
        Guild: role.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Role Removed").addFields(
        {name: "Role Name:", value: role.name, inline: false},
        {name: "Role ID:", value: role.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
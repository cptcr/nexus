const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    //Remove ban
    client.on(Events.GuildBanRemove, async (ban) => {
        const target = ban.user;
        const data = await Audit_Log.findOne({
            Guild: ban.guild.id
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed
        .setTitle('Ban removed')
        .addFields(
            {name: "Banned Member:", value: `${target}\nID: ${target.id}`, inline: false},
            {name: "Ban Reason:", value: `${ban.reason || "No reason given!"}`, inline: false},
        )
        await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {return;});
    });

}
const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    //Message Delete
    client.on(Events.MessageDelete, async (message) => {
        const data = await Audit_Log.findOne({
            Guild: message.guild.id,
        }).catch((err) => {return;});
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        try {
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed.setTitle("Message Deleted").addFields(
            {name: "Author:", value: `<@${message.user.id}>`, inline: false},
            {name: "Message:", value: `${message.content}`, inline: false},
            {name: "Message ID:", value: `${message.id}`}
        )
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
        } catch (err) {
            return;
        }
    })

}
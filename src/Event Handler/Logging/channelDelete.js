const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");

//WORKING

module.exports = async (client) => {
    //Channel Delete
    client.on(Events.ChannelDelete, async (channel) => {
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const data = await Audit_Log.findOne({
            Guild: channel.guild.id,
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditChannel = client.channels.cache.get(logID);
        auditEmbed.setTitle("Channel Deleted").addFields(
            {name: "Channel Name:", value: channel.name, inline: false},
            {name: "Channel ID:", value: channel.id, inline: false}
        )
        await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    })

}
const Audit_Log = require("../../../Schemas.js/auditlog");
const {client} = require("../../../index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../../embedConfig.json");
//Channel Create
client.on(Events.ChannelCreate, async (channel) => {
    const data = await Audit_Log.findOne({
        Guild: channel.guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Channel Created").addFields(
        {name: "Channel Name:", value: channel.name, inline: false},
        {name: "Channel ID:", value: channel.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
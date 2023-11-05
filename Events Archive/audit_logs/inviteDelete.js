const Audit_Log = require("../../../Schemas.js/auditlog");
const {client} = require("../../../index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../../embedConfig.json");
//Invite Delete
client.on(Events.InviteDelete, async (invite) => {
  
    const data = await Audit_Log.findOne({
        Guild: invite.guild.id 
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
  
    auditEmbed.setTitle("Invite Deleted").addFields(
        {name: "User:", value: `<@${invite.user.id}>`, inline: false},
        {name: "Invite Code:", value: `${invite.code}`, inline: false},
        {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
        {name: "Created at:", value: `${invite.createdAt}`, inline: false},
        {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
        {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
        {name: "URL", value: `${invite.url}`}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
  })
const Audit_Log = require("../../../src/Schemas.js/auditlog");
const {client} = require("../../../src/index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");

//Add ban
client.on(Events.GuildBanAdd, async (ban) => {
    const guild = ban.guild;
    const target = ban.user;
    const reason = ban.reason || 'No reason given';
    const data = await Audit_Log.findOne({
        Guild: guild.id
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
    .setTitle('Ban added')
    .addFields(
        {name: "Banned Member:", value: `Name: ${target.tag}\nID: ${target.id}`, inline: false},
        {name: "Reason:", value: `${reason}`, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {console.log(err)});
});
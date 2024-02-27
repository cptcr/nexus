const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const {generateHtmlTranscript} = require("../../../functions")

module.exports = async (client) => {
    //Bulk Delete
    client.on(Events.MessageBulkDelete, async (messages) => {
        const firstMessage = messages.first();
        const channel = firstMessage.channel;
        const guildId = channel.guild.id;
        const data = await Audit_Log.findOne({
          Guild: guildId
        })
        let logID;
        if (data) {
            logID = data.Channel
        } else {
            return;
        }
        const auditEmbed = new EmbedBuilder().setColor(theme.theme).setTimestamp().setFooter({ text: "Nexus Audit Log System"})
        const auditChannel = client.channels.cache.get(logID);
      
        const htmlContent = generateHtmlTranscript(messages, channel, guildId);
      
        const transcriptFilePath = path.join(__dirname, 'transcripts', `transcript_${Date.now()}.html`);
        fs.writeFileSync(transcriptFilePath, htmlContent);
      
        auditEmbed.setTitle("Message Bulk Delete").addFields(
            {name: "Messages Deleted:", value: `${messages.size}`, inline: false},
            {name: "Channel:", value: `${messages.channel}`, inline: false},
        )
        await auditChannel.send({ 
          embeds: [auditEmbed],
          files: [transcriptFilePath],}).catch((err) => {return;});
    })

}
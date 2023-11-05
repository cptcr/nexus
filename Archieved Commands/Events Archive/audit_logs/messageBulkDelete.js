const Audit_Log = require("../../../src/Schemas.js/auditlog");
const {client} = require("../../../src/index");
const {Events, EmbedBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");
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
  
    function generateHtmlTranscript(messages, channel, guildId) {
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Bulk Delete</title>
            </head>
            <body>
                <h1>Transscript - Deleted Messages</h1>
                <p>Channel: ${channel.name} (ID: ${channel.id})</p>
                <p>Server ID: ${guildId}</p>
                <p>Amount of deleted messages: ${messages.size}</p>
                <ul>
        `;
    
        messages.forEach(message => {
            const content = message.content || '[Picture/File]';
            html += `<li><strong>${message.author.tag}</strong>: ${content}</li>`;
        });
    
        html += `
                </ul>
            </body>
            </html>
        `;
    
        return html;
    }
  
    auditEmbed.setTitle("Message Bulk Delete").addFields(
        {name: "Messages Deleted:", value: `${messages.size}`, inline: false},
        {name: "Channel:", value: `${messages.channel}`, inline: false},
    )
    await auditChannel.send({ 
      embeds: [auditEmbed],
      files: [transcriptFilePath],}).catch((err) => {return;});
  })
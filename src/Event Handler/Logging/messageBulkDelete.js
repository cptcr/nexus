const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const theme = require('../../../embedConfig.json');
const Audit_Log = require('../../Schemas.js/auditlog');

module.exports = async (client) => {
    client.on(Events.MessageDeleteBulk, async (messages) => {
        let htmlContent = `
<html>
<head>
<style>
    body {
        background-color: #36393f;
        color: #ffffff;
        font-family: Arial, sans-serif;
    }
    .chat {
        margin: 10px;
    }
    .message {
        border-bottom: 1px solid #4f545c;
        padding: 5px;
    }
    .author {
        font-weight: bold;
    }
    .content {
        margin-left: 10px;
    }
    .embed {
        background-color: #2f3136;
        border-left: 4px solid #7289da;
        padding: 10px;
        margin-top: 10px;
    }
    .embed-title {
        font-weight: bold;
        color: #ffffff;
    }
    .embed-description {
        color: #ffffff;
    }
    .embed-field {
        color: #ffffff;
        margin-top: 5px;
    }
</style>
</head>
<body>
<div class="chat">`;

        messages.forEach(message => {
            let messageContent = message.content;
            let hasEmbed = message.embeds.length > 0;
            let hasContent = messageContent !== '';

            // Handle message content
            if (hasContent) {
                htmlContent += `<div class="message"><span class="author">${message.author.tag}:</span> <span class="content">${messageContent}</span></div>`;
            }

            // Handle embeds
            if (hasEmbed) {
                message.embeds.forEach(embed => {
                    htmlContent += `<div class="embed">`;
                    if (embed.title) htmlContent += `<div class="embed-title">${embed.title}</div>`;
                    if (embed.description) htmlContent += `<div class="embed-description">${embed.description}</div>`;
                    if (embed.fields) {
                        embed.fields.forEach(field => {
                            htmlContent += `<div class="embed-field"><strong>${field.name}</strong>: ${field.value}</div>`;
                        });
                    }
                    htmlContent += `</div>`;
                });
            }
        });

        htmlContent += `</div></body></html>`;

        fs.writeFileSync('transcript.html', htmlContent);
        console.log('Transcript saved as transcript.html');
    });
};

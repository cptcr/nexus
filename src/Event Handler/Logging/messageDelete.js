const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const Client = require("../../index").client;
const log_actions = require("../../Schemas.js/logactions");
const token = require("../../../encrypt").token(5);
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    // Message Delete
    client.on(Events.MessageDelete, async (message) => {
        perm(message);
        try {
            let messageSend = {
                embeds: [],
                components: [],
            }
            const data = await Audit_Log.findOne({ Guild: message.guild.id }).catch((err) => {
                return;
            });

            if (!data) return; 

            const logID = data.Channel;
            const auditChannel = client.channels.cache.get(logID);

            if (!auditChannel) {
                console.error("Audit channel not found.");
                return;
            }

            const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTimestamp()
            .setFooter({ text: `Nexus Audit Log System` });

            message.embeds.forEach(embed => {
                messageSend.embeds.push(embed)
            });

            if (message.components && message.components.length > 0) {
                message.components.forEach(component => {

                    component.components.forEach(button => {
                        button.disabled = true;
                    });

                    messageSend.components.push(component)
                });
            }

            auditEmbed.addFields({name: "Message Content:", value: message.content || "No content.", inline: false});

            auditEmbed
            .setTitle("Message Deleted")
            .addFields({name: "Author:", value: `<@${message.author.id}>`, inline: false})
            .addFields({name: "Message ID", value: `${message.id}`, inline: true})

            if (message.mentions && message.mentions.members.size > 0) {
                const mentionList = message.mentions.members.map(member => `<@${member.id}>`).join(", ");
                auditEmbed.addFields({ name: "Mentions:", value: mentionList });
            }
            

            messageSend.embeds.push(auditEmbed)

            await auditChannel.send(messageSend);
        } catch (err) {
            console.error("Error in messageDelete event:", err);
        }
    });
};

// Event handling code (Part of your Discord bot's code)
const { EmbedBuilder, Events } = require('discord.js');
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");
const Transcript = require("../../Schemas.js/transcript/list");
const perm = require("../../../functions").perm;

module.exports = async (client) => {
    client.on(Events.MessageBulkDelete, async (messages) => {
        perm(messages);
        if (!messages.size) return;
        const channel = messages.first().channel;
        const guildId = channel.guild.id;
        const auditData = await Audit_Log.findOne({ Guild: guildId });
        if (!auditData) return;
        const auditChannel = client.channels.cache.get(auditData.Channel);
        if (!auditChannel) return;

        const transcriptMessages = messages.map(message => ({
            messageId: message.id,
            authorId: message.author.id,
            authorTag: message.author.tag,
            content: message.content,
            timestamp: message.createdTimestamp,
            embeds: message.embeds.map(embed => ({
                title: embed.title,
                description: embed.description,
                url: embed.url,
                timestamp: embed.timestamp,
                color: embed.color,
                footer: embed.footer ? { text: embed.footer.text, iconURL: embed.footer.iconURL } : null,
                image: embed.image ? { url: embed.image.url } : null,
                thumbnail: embed.thumbnail ? { url: embed.thumbnail.url } : null,
                author: embed.author ? { name: embed.author.name, iconURL: embed.author.iconURL, url: embed.author.url } : null,
                fields: embed.fields ? embed.fields.map(field => ({ name: field.name, value: field.value, inline: field.inline })) : []
            }))
        }));

        const newTranscript = new Transcript({
            guildId,
            channelId: channel.id,
            messages: transcriptMessages,
        });

        await newTranscript.save();

        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle("Message Bulk Delete")
            .addFields(
                { name: "Messages Deleted", value: `${messages.size}`, inline: false },
                { name: "Channel", value: channel.name, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: "Nexus Audit Log System" });

        await auditChannel.send({ embeds: [auditEmbed] });
    });
};

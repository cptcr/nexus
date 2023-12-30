const { EmbedBuilder, Events } = require("discord.js");
const theme = require("../../../embedConfig.json");
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    client.on(Events.EmojiUpdate, async (oldEmoji, newEmoji) => {
        const changes = [];
        if (oldEmoji.name !== newEmoji.name) {
            changes.push(`Name: \`${oldEmoji.name}\` → \`${newEmoji.name}\``);
        }
        if (changes.length === 0) return;

        const auditEmbed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle("Emoji Updated")
            .addFields({ name: "Changes:", value: changes.join('\n') })
            .setTimestamp()
            .setFooter({ text: "Nexus Audit Log System" });

        const data = await Audit_Log.findOne({ Guild: oldEmoji.guild.id });
        let logID = data.Channel;
        if (!logID) return;

        const auditChannel = client.channels.cache.get(logID);
        await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {});
    });
};

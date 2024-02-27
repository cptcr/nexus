const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

const theme = require("../../../embedConfig.json");


//AUDIT LOG
const Audit_Log = require("../../Schemas.js/auditlog");

module.exports = async (client) => {
    client.on('messageCreate', (message) => {
        if (message.content.includes('discord.gg/') || /http\S+/.test(message.content)) {
            const data = Audit_Log.findOne({ Guild: message.guild.id });

            if (data) {
                const channel = message.guild.channels.cache.get(data.Channel)
    
                const embed = new EmbedBuilder()
                .setTitle("LINK DETECTED")
                .addFields(
                    {name: "Channel:", value: `${message.channel}`, inline: false},
                    {name: "User:", value: `${message.author}`, inline: false},
                ).setColor("Red")
                .setThumbnail(`${message.author.displayAvatarURL()}`)
                .setColor("Red")
    
                const button = new ButtonBuilder()
                .setDisabled(true)
                .setLabel(`${message.author.username}`)
                .setStyle(ButtonStyle.Danger)
    
                const button2 = new ButtonBuilder()
                .setDisabled(false)
                .setLabel("Jump to message")
                .setStyle(ButtonStyle.Link)
                .setEmoji('⚠️')
                .setURL(`https://ptb.discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
    
                const row = new ActionRowBuilder()
                .addComponents(button, button2)
    
                /*channel.send({
                    embeds: [embed],
                    components: [row]
                })*/
            }
        }
    });    
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require('axios');
const { execute } = require('../../events/interactionCreate');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: {
        name: "enlarge",
        description: "Enlarge a emoji",
        "integration_types": [0, 1],
        "contexts": [0, 1, 2],
        options: [
            {
                name: "emoji",
                required: true,
                type: 3,
                description: "Which emoji should i enlarge?"
            },
        ]
    },
    async execute(interaction) {
 
        let emoji = interaction.options.getString('emoji')?.trim();
 
        if (emoji.startsWith('<') && emoji.endsWith('>')) {
 
            const id = emoji.match(/\d{15,}/g)[0];
 
            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: 'You cann enlarge default emojis', ephemeral: true})
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: 'You cann enlarge default emojis', ephemeral: true})
        }
 
        const embed = new EmbedBuilder()
        .setColor(theme.theme)
        .setDescription('**Your emoji has been enlarged!**')
        .setImage(emoji)
        .setTimestamp()
        .setFooter({ text: 'Emoji Enlarged', iconURL: interaction.user.displayAvatarURL()})
 
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}
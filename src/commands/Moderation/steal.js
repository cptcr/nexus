const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Adds a given emoji to the server')
    .addStringOption(option => option.setName('emoji').setDescription('The emoji you would like to add to the server').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name for your emoji').setRequired(true)),
    async execute(interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Red")
        .setDescription("Missing Permissions: Manage Emojis and Stickers")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});

        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('name');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
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
            return await interaction.reply({ content: "You cannot steal default emojis!"})
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "You cannot steal default emojis!"})
        }

        if (emoji.startsWith("+")) {
            return;
        }

        if (emoji.startsWith("-")) {
            return;
        }

        if (emoji.startsWith("=")) {
            return;
        }

        if (name.startsWith("+")) {
            return ("You cant use those Characters!")
        }

        if (name.startsWith("-")) {
            return ("You cant use those Characters!")
        }

        if (name.startsWith("=")) {
            return ("You cant use those Characters!")
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor(theme.theme)
            .setDescription(`Added ${emoji}, with the name "**${name}**"`)

            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            console.log(err)
            interaction.reply({ content: "You cannot add this emoji because you have reached your server emoji limit", ephemeral: true})
        })
    }
}
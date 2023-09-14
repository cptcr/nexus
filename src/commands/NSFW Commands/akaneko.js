const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const akaneko = require("akaneko");
const disabled = require("../../Schemas.js/Panel/NSFW/akaneko");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("akaneko")
    .setDescription("get some random akaneko content")
    .setNSFW(true)
    .setDMPermission(true)
    .addStringOption(option => option
        .setName("type")
        .setDescription("Choose a type")
        .addChoices(
            {name: "ass", value: "ass"},
            {name: "bdsm", value: "bdsm"},
            {name: "gifs", value: "gifs"},
            {name: "glasses", value: "glasses"},
            {name: "hentai", value: "hentai"},
            {name: "maid", value: "maid"},
            {name: "masturbation", value: "masturbation"},
            {name: "pussy", value: "pussy"},
            {name: "school", value: "school"},
            {name: "thigs", value: "thigs"},
            {name: "uniform", value: "uniform"},
        )
        .setRequired(true)
    ),

    async execute (interaction) {
        const type = interaction.options.getString("type");

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle(`Category: ${type}`)
        if (type === "ass") {
            embed.setImage(await akaneko.nsfw.ass())
        }

        if (type === "bdsm") {
            embed.setImage(await akaneko.nsfw.bdsm())
        }

        if (type === "gifs") {
            embed.setImage(await akaneko.nsfw.gifs())
        }

        if (type === "glasses") {
            embed.setImage(await akaneko.nsfw.glasses())
        }

        if (type === "hentai") {
            embed.setImage(await akaneko.nsfw.hentai())
        }

        if (type === "maid") {
            embed.setImage(await akaneko.nsfw.maid())
        }

        if (type === "masturbation") {
            embed.setImage(await akaneko.nsfw.masturbation())
        }

        if (type === "pussy") {
            embed.setImage(await akaneko.nsfw.pussy())
        }

        if (type === "school") {
            embed.setImage(await akaneko.nsfw.school())
        }

        if (type === "thigs") {
            embed.setImage(await akaneko.nsfw.thighs())
        }

        if (type === "uniform") {
            embed.setImage(await akaneko.nsfw.uniform())
        }

        await interaction.reply({ embeds: [embed] });
    }
}
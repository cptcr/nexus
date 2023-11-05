
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("privacy-policy")
    .setDescription("Our privacy policy"),

    async execute (interaction) {
        const embed = new EmbedBuilder()
        .setTitle("Privacy Policy")
        .setURL("https://nexus.nexus-hosting.tech/privacy-policy/main.php")
        .setDescription("You can find our privacy policy here: \nhttps://nexus.nexus-hosting.tech/privacy-policy/main.php")
        .setColor(theme.theme)

        await interaction.reply({ embeds: [embed] });
    }
}
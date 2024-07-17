const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName("bot-status")
        .setDescription("Displays the current status of the bot."),
    async execute(interaction, client) {
        const uptime = client.uptime;
        const uptimeEmbed = new EmbedBuilder()
            .setTitle("Bot Status")
            .addFields(
                { name: "Uptime", value: `${Math.floor(uptime / 1000 / 60)} minutes` },
                { name: "Servers", value: `${client.guilds.cache.size}` },
                { name: "Users", value: `${client.users.cache.size}` }
            );
        interaction.reply({ embeds: [uptimeEmbed], ephemeral: true });
    }
}

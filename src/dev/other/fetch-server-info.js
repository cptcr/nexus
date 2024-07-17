const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName("server-info")
        .setDescription("Fetches detailed information about a server.")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("The server id")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const serverId = interaction.options.getString("id");
        const server = client.guilds.cache.get(serverId);

        if (!server) return interaction.reply({ content: "Server not found.", ephemeral: true });

        const serverEmbed = new EmbedBuilder()
            .setTitle(`Server Info: ${server.name}`)
            .setThumbnail(server.iconURL())
            .addFields(
                { name: "ID", value: server.id, inline: true },
                { name: "Owner", value: `<@${server.ownerId}>`, inline: true },
                { name: "Members", value: `${server.memberCount}`, inline: true },
                { name: "Created At", value: server.createdAt.toDateString(), inline: true }
            );

        interaction.reply({ embeds: [serverEmbed], ephemeral: true });
    }
}

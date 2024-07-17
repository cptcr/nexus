const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Fetches detailed information about a user.")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("The user id")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const userId = interaction.options.getString("id");
        const user = await client.users.fetch(userId);

        if (!user) return interaction.reply({ content: "User not found.", ephemeral: true });

        const userEmbed = new EmbedBuilder()
            .setTitle(`User Info: ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "ID", value: user.id, inline: true },
                { name: "Username", value: user.username, inline: true },
                { name: "Discriminator", value: user.discriminator, inline: true },
                { name: "Created At", value: user.createdAt.toDateString(), inline: true }
            );

        interaction.reply({ embeds: [userEmbed], ephemeral: true });
    }
}

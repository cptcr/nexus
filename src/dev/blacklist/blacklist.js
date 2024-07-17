const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const schemaUser = require("../../Schemas.js/Blacklist/blacklist");
const schemaServer = require("../../Schemas.js/Blacklist/blacklistserver");

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklists a server or a user from using the bot.")
        .addSubcommand(c => c
            .setName("server-add")
            .setDescription("Add a server to the blacklist.")
            .addStringOption(o => o
                .setName("id")
                .setDescription("The server id")
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName("server-remove")
            .setDescription("Remove a server from the blacklist.")
            .addStringOption(o => o
                .setName("id")
                .setDescription("The server id")
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName("servers-list")
            .setDescription("Gives a list of all blacklisted servers.")
        )
        .addSubcommand(c => c
            .setName("user-add")
            .setDescription("Add a user to the blacklist.")
            .addStringOption(o => o
                .setName("id")
                .setDescription("The user id")
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName("user-remove")
            .setDescription("Remove a user from the blacklist.")
            .addStringOption(o => o
                .setName("id")
                .setDescription("The user id")
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName("users-list")
            .setDescription("Gives a list of all blacklisted users.")
        ),

    async execute(interaction, client) {
        const { guild, options, user } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "server-add":
                const serverId = options.getString("id");
                const server = client.guilds.cache.get(serverId);
                if (!server) return interaction.reply({ content: "Server not found.", ephemeral: true });

                await schemaServer.create({
                    Guild: serverId,
                    Reason: "Blacklisted by command",
                    Moderator: user.id,
                });

                interaction.reply({ content: `Server ${serverId} has been blacklisted.`, ephemeral: true });
                break;

            case "server-remove":
                const removeServerId = options.getString("id");

                await schemaServer.deleteOne({ Guild: removeServerId });

                interaction.reply({ content: `Server ${removeServerId} has been removed from the blacklist.`, ephemeral: true });
                break;

            case "servers-list":
                const blacklistedServers = await schemaServer.find({});
                if (blacklistedServers.length === 0) return interaction.reply({ content: "No servers are blacklisted.", ephemeral: true });

                const serverList = blacklistedServers.map(server => server.Guild).join("\n");

                const serverEmbed = new EmbedBuilder()
                    .setTitle("Blacklisted Servers")
                    .setDescription(serverList);

                interaction.reply({ embeds: [serverEmbed], ephemeral: true });
                break;

            case "user-add":
                const userId = options.getString("id");

                await schemaUser.create({
                    User: userId,
                    Reason: "Blacklisted by command",
                    Moderator: user.id,
                });

                interaction.reply({ content: `User ${userId} has been blacklisted.`, ephemeral: true });
                break;

            case "user-remove":
                const removeUserId = options.getString("id");

                await schemaUser.deleteOne({ User: removeUserId });

                interaction.reply({ content: `User ${removeUserId} has been removed from the blacklist.`, ephemeral: true });
                break;

            case "users-list":
                const blacklistedUsers = await schemaUser.find({});
                if (blacklistedUsers.length === 0) return interaction.reply({ content: "No users are blacklisted.", ephemeral: true });

                const userList = blacklistedUsers.map(user => user.User).join("\n");

                const userEmbed = new EmbedBuilder()
                    .setTitle("Blacklisted Users")
                    .setDescription(userList);

                interaction.reply({ embeds: [userEmbed], ephemeral: true });
                break;
        }
    }
}

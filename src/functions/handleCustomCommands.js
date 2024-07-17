const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
    /**
     * Automatically loads and registers custom commands for each guild based on directory names.
     * 
     * @param {string} path - The base path to the guild-specific folders containing the command files.
     */
    client.handleGuildCommands = async (path) => {
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        // Retrieve all guild directories.
        const guildFolders = fs.readdirSync(path, { withFileTypes: true })
                               .filter(dirent => dirent.isDirectory())
                               .map(dirent => dirent.name);

        // Process each guild directory.
        for (const guildId of guildFolders) {
            let commandArray = [];  // Array to store command data for this guild.

            // Check and process each command file in the guild's folder.
            const commandFiles = fs.readdirSync(`${path}/${guildId}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../custom-commands/${guildId}/${file}`);
                client.commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }

            // Register the commands to the specific guild.
            try {
                console.log(`[ CLIENT ] Started refreshing application (/) commands for guild: ${guildId}`);

                await rest.put(
                    Routes.applicationGuildCommands(process.env.ID, guildId), {
                        body: commandArray
                    },
                );

                console.log(`[ CLIENT ] Successfully reloaded application (/) commands for guild: ${guildId}`);
            } catch (error) {
                console.error(`Error loading commands for guild ${guildId}:`, error);
            }
        }
    };
};
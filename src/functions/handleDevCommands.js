const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (client) => {
    /**
     * 
     * @param {string} commandFolders - Your dev-command-folder
     * @param {string} path - the path to the files
     * @returns {string} - Uploads command data to the Discord REST Api V9
    */
    client.handleDevCommands = async (commandFolders, path) => {
        const clientId = process.env.ID.toString();
        const devGuildId = `${process.env.DEVGUILDID}`;
        client.commandArray = [];
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../dev/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                console.log(chalk.green(`[ CMD ] Loaded command: ${command.data.name} from file: ${file}`));
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN.toString());

        (async () => {
            try {
                console.log(chalk.yellow('[ CMD ] Started refreshing application (/) developer commands.'));

                await rest.put(
                    Routes.applicationGuildCommands(clientId, devGuildId), {
                        body: client.commandArray
                    },
                );

                console.log(chalk.cyan('[ CMD ] Successfully reloaded application (/) developer commands.'));
            } catch (error) {
                console.error(chalk.red('[ CMD ] Error reloading application (/) developer commands:', error));
            }
        })();
    };
};

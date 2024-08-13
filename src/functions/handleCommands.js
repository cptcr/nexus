const fs = require("fs");
const chalk = require("chalk");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require("discord.js");
let count = 0;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                if (command.data instanceof SlashCommandBuilder) {
                    client.commandArray.push(command.data.toJSON());
                } else {
                    client.commandArray.push(command.data);
                }
                count++;
                console.log(chalk.green(`[ CMD ] Loaded command: ${command.data.name} from file: ${file}`));
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log(chalk.yellow('[ CMD ] Started refreshing application (/) commands.'));

                await rest.put(
                    Routes.applicationCommands(process.env.ID), {
                        body: client.commandArray
                    },
                );

                console.log(chalk.green('[ CMD ] Successfully reloaded application (/) commands.'));
                console.log(chalk.cyan(`[ CMD ] Total commands registered: ${count}`));

            } catch (error) {
                console.error(chalk.red('[ CMD ] Error while reloading application (/) commands:', error));
            }
        })();
    };
    return { getCount: count };
};

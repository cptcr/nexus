const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require("discord.js");
var countCmd = 0;

var count = 0;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                countCmd++
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);

                if (command.data instanceof SlashCommandBuilder) {
                    client.commandArray.push(command.data.toJSON());
                } else {
                    client.commandArray.push(command.data);
                }

                count++;
            }
        }

        console.log("Found ", count, " Command Files")


        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log(`Started refreshing ${count} application (/) commands.`);

                await rest.put(
                    Routes.applicationCommands(process.env.ID), {
                        body: client.commandArray
                    },
                );

                console.log(`-> Successfully reloaded ${count} application (/) commands.`);

            } catch (error) {
                console.error(error);
            }
        })();
    };
};
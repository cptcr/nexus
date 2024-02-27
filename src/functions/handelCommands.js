const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const clientId = '1046468420037787720'; 
const guildId = 'YOUR GUILD ID'; 
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
                client.commandArray.push(command.data.toJSON());

                count++;
            }
        }

        console.log("Found ", count, " Command Files")


        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                //console.log(`Started refreshing ${count} application (/) commands.`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
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
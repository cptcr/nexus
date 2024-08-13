const { REST, Routes } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();

const { TOKEN, ID } = process.env;

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(chalk.yellow('Fetching application (/) commands.'));

        let commands;
        commands = await rest.get(
            Routes.applicationCommands(ID)
        );
        console.log(chalk.cyan('Listing global commands:'));

        if (commands.length === 0) {
            console.log(chalk.red('No commands found.'));
        } else {
            commands.forEach(command => {
                console.log(chalk.green(`Name: ${command.name}, Description: ${command.description}, ID: ${command.id}`));
            });
        }
    } catch (error) {
        console.error(chalk.red('Error fetching commands:', error));
    }
})();

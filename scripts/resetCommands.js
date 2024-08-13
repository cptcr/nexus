const { REST, Routes } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();

const { TOKEN, ID } = process.env;

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(chalk.red.bold("WARNING: THIS SCRIPT WILL NOT AFFECT GUILD COMMANDS!"));
        setTimeout(() => {}, 1000);
        console.log(chalk.yellow('Started clearing (deleting) all application (/) commands.'));
        
        await rest.put(
            Routes.applicationCommands(ID),
            { body: [] }
        );

        console.log(chalk.green('Successfully deleted all global commands.'));
        console.log(chalk.cyan('Restart the bot to deploy all commands again. (use node .)'));
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
})();

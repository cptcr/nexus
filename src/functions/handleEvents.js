const chalk = require('chalk');

let count = 0;
let eventsStatus = false;

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            count++;
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(chalk.green(`[ EVENT ] Loaded event: ${event.name} from file: ${file}`));
        }
        eventsStatus = true;

        // Enable if you want by removing "/* and */"
        /*(async () => {
            try {
                console.log(chalk.yellow(`Started refreshing ${count} application events.`));
                console.log(chalk.cyan(`Successfully reloaded ${count} application events.`));
            } catch (error) {
                console.error(chalk.red('Error while reloading application events:', error));
            }
        })();*/
    };

    return {
        getECount: () => count,
        getEventsStatus: () => eventsStatus
    };
};

var count = 0;
var eventsStatus = false;

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
        }
        eventsStatus = true
        //Enable if you want by removing "/* and */"
        /*(async () => {
            try {
                console.log(`Started refreshing ${count} application events.`);

                console.log(`Successfully reloaded ${count} application events.`);

            } catch (error) {
                console.error(error);
            }
        })();*/
    };
    return { getECount: count, getEventsStatus: eventsStatus };
}
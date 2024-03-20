const {InteractionType} = require("discord.js");

module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const command = client.commands.get(interaction.commandName);
            if (command && command.autocomplete) {
                await command.autocomplete(interaction, client);
            }
        }
    });
    
}
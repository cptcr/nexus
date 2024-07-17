const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads a specific command.")
        .addStringOption(option =>
            option.setName("command")
                .setDescription("The command to reload")
                .setRequired(true)
        )
        .addStringOption(o => o
            .setName("type")
            .setDescription("Which type is the command?")
            .addChoices(
                {name: "regular", value: "commands"},
                {name: "developer guild", value: "dev"},
                {name: "custom", value: "custom-commands"},
                {name: "user installed", value: "user-installed-commands"}
            )
        )
        .addStringOption(o => o
            .setName("folder")
            .setDescription("the folder the command is in")
            .addChoices(
                { name: "Audit", value: "Audit"},
                { name: "Color", value: "Color"},
                { name: "Community", value: "Community"},
                { name: "Influx", value: "Influx"},
                { name: "Interaction", value: "Interaction"},
                { name: "Menus", value: "Menus"},
                { name: "Mod", value: "Mod"},
                { name: "Nexus", value: "Nexus"},
                { name: "Other", value: "Other"},
                { name: "Panel", value: "Panel"},
                { name: "Reply", value: "Reply"},
                { name: "System", value: "System"},
                { name: "Ticket", value: "Ticket"},
                { name: "Warn", value: "Warn"},
                { name: "XP", value: "XP"},
                { name: "Bot", value: "bot"},
                { name: "other", value: "other"},
            )
        ),
    async execute(interaction, client) {
        const commandName = interaction.options.getString("command").toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) return interaction.reply({ content: `There is no command with name \`${commandName}\`.`, ephemeral: true });

        delete require.cache[require.resolve(`../${command.data.name}.js`)];

        try {
            const newCommand = require(`../../${interaction.options.getString("type")}/${interaction.options.getString("folder")}/${command.data.name}.js`);
            client.commands.set(newCommand.data.name, newCommand);
            interaction.reply({ content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``, ephemeral: true });
        }
    }
}

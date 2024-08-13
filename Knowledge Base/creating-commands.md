## Creating commands
You can create commands in the src/commands folder. In there you can create subfolders for each category youd like to have to manage commands easier for yourself.

Search for a folder youd like to create the command in or just create a new one. The name doesnt affect anything of the bot itself or the rest of the code.

Create a command file with the name youd like to have for the file. 

In this we use this base code (you can choose one of them):

**Using the SlashCommandBuilder:**

You can use the SlashCommandBuilder for creating almost every command. For User Installed commands, you will need the other example code.
```js
const { 
    SlashCommandBuilder, // The builder for slash commands
    PermissionFlagsBits, // For permission flags
} = require("discord.js");

// Exporting the command along with execute data
module.exports = {
    data: new SlashCommandBuilder() // Initializing the builder, which is required to construct the command
        .setName("example") // Set the name of the command, which is required and should be lowercase
        .setDescription("Example command description") // Set the description of the command, which is required
        .setDefaultMemberPermissions(PermissionUncher.MAX) // Limits command visibility to members with specified permissions
        .setDMPermission(false) // Whether the command can be used in direct messages
        // Adding a string option to the command
        .addStringOption(option => 
            option.setName("input")
                .setDescription("Input description")
                .setRequired(true) // Marks the option as required for the user to provide
                .addChoices( // Provide choices for the user to pick from
                    { name: "Choice1", value: "choice1" },
                    { name: "Choice2", value: "choice2" }
                )
                .setAutocomplete(true) // Enables autocomplete for this option
        )
        // Adding a boolean option
        .addBooleanOption(option => 
            option.setName("flag")
                .setDescription("True or False?")
                .setRequired(false) // This option is not required
        )
        // Adding an integer option
        .addIntegerOption(option => 
            option.setName("number")
                .setDescription("Enter a number")
                .setMinValue(1) // Minimum value
                .setMaxValue(100) // Maximum value
                .setRequired(false)
        )
        // Adding a user option
        .addUserOption(option => 
            option.setName("target")
                .setDescription("Select a user")
                .setRequired(false)
        )
        // Adding a channel option
        .addChannelOption(option => 
            option.setName("channel")
                .setDescription("Select a channel")
                .setRequired(false)
        )
        // Adding a role option
        .addRoleOption(option => 
            option.setName("role")
                .setDescription("Select a role")
                .setRequired(false)
        )
        // Adding a mentionable option (user, role, etc.)
        .addMentionableOption(option => 
            option.setName("mentionable")
                .setDescription("Mention something")
                .setRequired(false)
        )
        // Adding a number option (floats)
        .addNumberOption(option => 
            option.setName("float")
                .setDescription("Enter a floating-point number")
                .setRequired(false)
                .setMinValue(0.1)
                .setMaxValue(9.9)
        )
        // Adding subcommands or subcommand groups if needed
        .addSubcommand(subcommand => 
            subcommand.setName("subcommand1")
                .setDescription("Subcommand 1 description")
                .addStringOption(option => option.setName("subinput").setDescription("Input for subcommand 1"))
        )
        .addSubcommandGroup(group => 
            group.setName("group1")
                .setDescription("Subcommand group description")
                .addSubSulre("subcommand2")
                    .setDescription("Subcommand 2 description")
                    .addStringOption(option => option.setName("subinput2").setDescription("Input for subcommand 2"))
        ),
    async execute(interaction) {
        // Handle the command execution here
    },
    async autocomplete(interaction) {
        // Handle autocomplete functionality here if you have a setAutocomplete(true) string option.
    }
}
```
# Developer only commands
By adding `devOnly: true,` in your command code, the command will only be executed if the `interaction.user.id` is in the developer array of the .env file. Otherwise it will response with a message that warns the user for not being a developer. To make a non-developer command you can simply not add `devOnly: true,` or just do `devOnly: false,`. The following code is an example for a dev-only command.
```js
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    devOnly: true,
    data: new SlashCommandBuilder()
    .setName("dev-only-command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("This is a example code for a developer only command"),
    async execute (interaction) {
    }
}
```
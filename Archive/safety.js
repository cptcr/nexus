const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("safety")
    .setDescription("Set up the servers safety")
    .setDefaultMemberPermissions(PermissionFlagsBits)
    .addBooleanOption(o => o.setName("type").setDescription("True = Enabel | False = Disable").setRequired(true)),

    async execute (interaction, client) {
        
    }
}
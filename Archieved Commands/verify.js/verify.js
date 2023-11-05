const { SlashCommandBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/verifySchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify in this Server!"),
    async execute (interaction, client) {
        const data = await Schema.findOne({
            Guild: interaction.guild.id,
        });

        if (data) {

            const role = await interaction.guild.roles.cache.get(data.Role);

            await interaction.member.roles.add(role);

            if (interaction.member.roles.cache.has(role.id)) {
                await interaction.reply({
                    content: "You already have been verified",
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: "You have been verified!",
                    ephemeral: true
                })
            }
        } else {
            await interaction.reply({
                content: "This server doesnt have a verify system!",
                ephemeral: true
            })
        }
    }
}
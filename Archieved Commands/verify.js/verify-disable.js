const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Schemas.js/verifySchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("verify-disable")
    .setDescription("Disable the verification system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute (interaction) {
        const data = await Schema.findOne({
            Guild: interaction.guild.id
        });

        if (data) {
            await Schema.deleteMany({
                Guild: interaction.guild.id
            }).catch(err => {
                interaction.reply({
                    content: "There was an error deleting your verify system!",
                    ephemeral: true
                })
                console.log(err)
            })

            await interaction.reply({
                content: "Verify system deleted!",
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: "You dont have a verify system in this Server!",
                ephemeral: true
            })
        }
    }
}
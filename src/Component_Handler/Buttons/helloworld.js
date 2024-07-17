module.exports = {
    async run(interaction, client) {
        return await interaction.reply({
            content: "You stink!",
            ephemeral: true
        })
    }
}
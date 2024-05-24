module.exports = {
    async run(interaction) {
        return await interaction.reply({
            content: "You stink!",
            ephemeral: true
        })
    }
}
const {ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js'); //required builders

module.exports = {
    data: new ContextMenuCommandBuilder() //create a new Context Menu Command
    .setName('Return User ID') //setup the name
    .setType(ApplicationCommandType.User), //Type of the Context
    async execute (interaction) { //if ineraction....

        const { member } = interaction;

        const { targetId } = interaction //const target = the interaction user

        await interaction.reply({ content:`User ID: ${targetId}`, ephemeral: true}) //reply the ID as ephemeral

        console.log(`${member.id}, ${member.name}`)
    }
}
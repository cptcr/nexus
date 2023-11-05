const {SlashCommandBuilder, EmbedBuilder, Embed} = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Gives you a random answer from the given options")
    .addStringOption(option => option
        .setName("option-1")
        .setDescription("the first option")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("option-2")
        .setDescription("The second option")
        .setRequired(true)
    ),

    async execute (interaction) {

        const op1 = interaction.options.getString("option-1");
        const op2 = interaction.options.getString("option-2");
        const choices = [`${op1}`, `${op2}`];

        const answer = Math.floor(Math.random() * choices.length);

        const embed = new EmbedBuilder()
        .setTitle("Here is the answer!")
        .addFields({ name: `User: `, value: `<@${interaction.user.id}>`, inline: true})
        .addFields({ name: `Answer: `, value: `${choices[answer]}`, inline: true})
        .addFields({ name: "Option 1: ", value: `${op1}`, inline: false})
        .addFields({ name: "Option 2: ", value: `${op2}`})
        .setColor(theme.theme)
        .setTimestamp()

        return interaction.reply({ embeds: [embed] });

    }
}
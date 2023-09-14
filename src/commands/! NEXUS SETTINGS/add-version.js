const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Schemas.js/Nexus/update");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-ver")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Update the version and features of nexus")
    .addStringOption(option => option
        .setName("version")
        .setDescription("The new Version")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("features")
        .setDescription("Use % to create a new line")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {options} = interaction;
        const version = options.getString("version");
        const features = options.getString("features");

        if (interaction.user.id !== process.env.OWNERID) {
            return await interaction.reply({
                content: "You have to be the bot owner to use this command!",
                ephemeral: true
            })
        }

        function newLine(text) {
            const lines = text.split('%');
            const formattedText = lines.join('\n');
            return formattedText;
        }

        const inputText = features;
        const outputText = newLine(inputText);

        const embed = new EmbedBuilder()
        .setTitle(`Nexus version ${version}`)
        .setDescription(outputText)
        .setColor("White")

        await Schema.findOneAndDelete().catch(err => {
           interaction.deferReply({ ephemeral: true})
           interaction.reply(`\`\`\`${err}\`\`\``)
        });

        await Schema.create({
            Version: version,
            Description: outputText,
        })

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

}
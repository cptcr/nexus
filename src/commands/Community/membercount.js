const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("membercount"),
    
    async execute(interaction) {

        const embed = new EmbedBuilder()
        .setColor(theme.theme)
        .setTitle("membercount")
        .addFields({ name: "Members:", value: `${interaction.guild.memberCount}`})
        return await interaction.reply({embeds: [embed]})
    }
}


const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Schemas.js/autoreply");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("autoreply-delete")
    .setDescription("Delete the autoreply in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option
        .setName("keyword")
        .setDescription("the keyword for the reply")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const embed = new EmbedBuilder();

        const {options, guild} = interaction;
        const g = guild.id;
        const keyword = options.getString("keyword");

        const data = await Schema.findOne({ Guild: g, Keyword: keyword });

        if (data) {
            embed.setDescription(`Deleted Autoreply for **${keyword}**! | Reply: **${data.Reply}**`).setColor("Red")

            await Schema.deleteMany({
                Guild: g,
                Keyword: keyword
            })

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } else {
            embed.setColor("White").setDescription(`Error: could not find a schema for **${keyword}**!`)

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
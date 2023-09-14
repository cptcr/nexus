const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const Schema = require("../../Schemas.js/auditlog");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("auditlog-delete")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Delete the audit log system in your server"),
    async execute (interaction) {
        const {options, guild} = interaction;

        const data = await Schema.findOne({
            Guild: guild.id,
        });
        if (!data) {
            return await interaction.reply("You dont have a audit log system here!")
        }
        const embed = new EmbedBuilder()
        .setTitle("Audit Log Setup")
        .setDescription(`Your Audit Log has been deleted!`)
        .setFooter({ text: "Nexus Utils Audit Log System" })
        .setColor("White")

        await Schema.deleteMany({
            Guild: guild.id,
        });

        return await interaction.reply({
            embeds: [embed],
        })
    }
}
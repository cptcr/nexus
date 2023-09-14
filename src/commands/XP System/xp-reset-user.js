const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const levelSchema = require("../../Schemas.js/Leveling/level");
const disabled = require("../../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-user-reset")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Reset a users rank to zero!")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user")
        .setRequired(true)
    ),
    async execute (interaction, client) {
        const user = interaction.options.getMember("user")
        const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: ${user.id} has no XP to reset!`)
        .setTimestamp()
        const embed2 = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: <@${user.id}>'s XP has been resetted!`)
        .setTimestamp()
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
        if (!Data) {
            return await interaction.reply({ embeds: [embed], ephemeral: true})
        } else {
            await levelSchema.deleteMany({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {
                await interaction.reply({ embeds: [embed2] });
            }).catch(err => {
                return;
            });
        }
    }
}
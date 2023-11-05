const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const levelSchema = require("../Schemas.js/Leveling/level");
const disabled = require("../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-server-reset")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Reset a complete discord server XP!"),
    async execute (interaction, client) {
        const Data = await levelSchema.findOne({ Guild: interaction.guild.id});
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: This server has no XP to reset!`)
        .setTimestamp()
        const embed2 = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: THe XP of this server has been resetted!`)
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
            await levelSchema.deleteMany({ Guild: interaction.guild.id}, async (err, data) => {
                await interaction.reply({ embeds: [embed2] });
            });
        }
    }
}
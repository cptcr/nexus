const {EmbedBuilder, PermissionsBitField, Permissions, PermissionFlagsBits, SlashCommandBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unban a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("uban id")
        .setRequired(true)
        ),

    async execute(interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor(theme.theme)
        .setDescription("Missing Permissions: Ban Members")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});
        const {channel, options} = interaction;

        const userId = interaction.options.getString("userid");

        try{ 
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
            .setDescription(`${userId} has been unbanned`)
            .setColor(theme.theme);

            await interaction.reply({
                embeds: [embed],
            });
        } catch(err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Please provide a valid member ID.`)
                .setColor(theme.theme)

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}
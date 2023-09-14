const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js"); // Fixing import typo
const warningSchema = require("../../Schemas.js/warnSchema"); // Fixing import path
const disabled = require("../../Schemas.js/Panel/Systems/warn");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('This clears a member\'s warnings')
    .addUserOption(option => option.setName("user").setDescription("The user you want to clear the warnings of").setRequired(true))
    .addStringOption(option => option.setName("warn-id").setDescription("The ID of the warning").setRequired(true)),
  async execute(interaction) {

    const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });
    const iD = interaction.options.getString("warn-id");

    if (DISABLED) {
      await interaction.reply({
        content: "❌ Command has been disabled in this server!",
        ephemeral: true
      });
      return;
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      await interaction.reply({
        content: `You don't have permission to clear people's warnings!`,
        ephemeral: true
      });
      return;
    }

    const { options, guildId } = interaction; // Removed 'user' from destructuring, not used.

    const target = options.getUser("user");

    // Correct the query to use findOneAndUpdate with $pull operator
    warningSchema.findOneAndUpdate(
      { GuildID: guildId, UserID: target.id },
      { $pull: { Content: { warnID: iD } } },
      { new: true }, // To return the updated document
      async (err, data) => {
        if (err) throw err;

        if (data) {
          const embed = new EmbedBuilder()
            .setColor("Red") // Corrected color to uppercase
            .setDescription(`:white_check_mark: ${target.tag}'s warning has been cleared`)
            .setFooter({ text: "Command made by toowake"})

          interaction.reply({ embeds: [embed] });
        } else {
          interaction.reply({ content: `I cannot find the ID **${iD}**!`, ephemeral: true });
        }
      });
  }
};
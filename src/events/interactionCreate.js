const { Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, DataManager, PermissionsBitField } = require("discord.js");
//blacklist user
const blacklist = require('../Schemas.js/Blacklist/blacklist');
 
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const data = await blacklist.findOne({User: interaction.user.id});
    if (data) return await interaction.reply(`You have been blacklisted from this Bot! Reason: \`${blacklist.Reason}\``);

    if (!interaction.isCommand()) return;
      const command = client.commands.get(interaction.commandName);
      if (!command) return
      try{
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);  
        await interaction.reply({
          content: 'There was an error while executing this command. I have sent your crash report to the support server.',
          ephemeral: true,
        });
      }
    }
};


const { Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, DataManager, PermissionsBitField } = require("discord.js");
//blacklist user
const blacklist = require('../Schemas.js/Blacklist/blacklist');
const owner = require("../../owner.json").owners;
const mainSchema = require("../Schemas.js/main");
const dataMain = mainSchema.findOne({Type: "Main" });
 
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const data = await blacklist.findOne({User: interaction.user.id});
    if (data) return await interaction.reply(`You have been blacklisted from this Bot! Reason: \`${blacklist.Reason}\``);

    if (!interaction.isCommand()) return;
      const command = client.commands.get(interaction.commandName);
      if (!command) return
      try{
        var maintenance;

        setInterval(() => {
          if (dataMain) {
            maintenance = true
          } else {
            maintenance = false
          }

        }, 1000)

        if (maintenance) {
          if (!owner.includes(interaction.user.id)) {
            await interaction.reply({
              content: `${client.user.username} is currently under maintenance!`,
              ephemeral: true
            })
          } else {
            await command.execute(interaction, client)
          }
        } else {
          await command.execute(interaction, client);
        }
      } catch (error) {
        console.log(error);  
        await interaction.reply({
          content: 'There was an error while executing this command. Join discord.gg/nexcord to report any issues to the developers!',
          ephemeral: true,
        });
      }
    }
};


const { Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, DataManager, PermissionsBitField, Embed } = require("discord.js");
//blacklist user
const blacklist = require('../Schemas.js/Blacklist/blacklist');
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
          if (!process.env.OWNERID.includes(interaction.user.id)) {
            await interaction.reply({
              content: `${client.user.username} is currently under maintenance!`,
              ephemeral: true
            })
          } else {
            await command.execute(interaction, client)
          }
        } else {

          if (command.devOnly && process.env.OWNERID.includes(interaction.user.id)) {
            await command.execute(interaction, client);
          } else if (command.devOnly && !process.env.OWNERID.includes(interaction.user.id)) {
            await interaction.reply({
              content: "This command is a developer only command!",
              ephemeral: true
            })
          } else {
            await command.execute(interaction, client);
          }
        }
      } catch (error) {
        console.log(error);  

        const embed = new EmbedBuilder({
          fields: [
            {name: "Command:", value:`/${interaction.commandName}`, inline: true},
            {name: "User:", value:`${interaction.user}`, inline: true},
            {name: "Error:", value: `${error}`, inline: false}
          ],
          title: "There was an error!"
        }).setColor("Green").setDescription("https://discord.gg/toowake")

        const channel = await client.channels.cache.get("1127250005065994321")
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });

        await  channel.send({embeds: [embed.setDescription("Someone executed a command and got an error!")]})
      }
    }
};


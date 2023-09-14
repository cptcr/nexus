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
  
            const channelID = '1127250005065994321';
            const channel = client.channels.cache.get(channelID);   
          
  
            const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTimestamp()
            .setFooter({ text: 'Error Reported At' })
            .setTitle('Command Execution Error')
            .setDescription('An error occurred while executing the command.')
            .addFields(
              { name: '> •   Command', value: `\`\`\`${interaction.commandName}\`\`\`` },
              { name: '> •   Triggered By', value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\`` },
              { name: '> •   Error Stack', value: `\`\`\`${error.stack}\`\`\`` },
              { name: '> •   Error Message', value: `\`\`\`${error.message}\`\`\`` }
            );
          // Send the initial embed with buttons
          const message = await channel.send({ embeds: [embed]});        
        await interaction.reply({
          content: 'There was an error while executing this command. I have sent your crash report to the support server.',
          ephemeral: true,
        });
      }
     }
};


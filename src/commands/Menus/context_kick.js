const { 
    ApplicationCommandType, 
    PermissionsBitField, 
    EmbedBuilder, 
    ContextMenuCommandBuilder 
} = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Kick')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
        .setDMPermission(false),

    async execute(interaction) {
        const user = await interaction.guild.members.fetch(interaction.targetId);
        
        if (!user.bannable) {
            return await interaction.reply({ 
                content: 'I cannot kick this user.', 
                ephemeral: true 
            });
        }
        
        await user.kick()
            .then(() => interaction.reply({ 
                content: `Successfully kicked ${user.user.tag}`, 
                ephemeral: true 
            }))
            .catch(error => {
                interaction.reply({ 
                    content: 'There was an error trying to kicking this user.', 
                    ephemeral: true 
                });
            });
    }
};

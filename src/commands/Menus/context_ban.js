const { 
    ApplicationCommandType, 
    PermissionsBitField, 
    EmbedBuilder, 
    ContextMenuCommandBuilder 
} = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Ban')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        const user = await interaction.guild.members.fetch(interaction.targetId);
        
        if (!user.bannable) {
            return await interaction.reply({ 
                content: 'I cannot ban this user.', 
                ephemeral: true 
            });
        }
        
        await user.ban({ reason: 'Banned via context menu' })
            .then(() => interaction.reply({ 
                content: `Successfully banned ${user.user.tag}`, 
                ephemeral: true 
            }))
            .catch(error => {
                console.error(error);
                interaction.reply({ 
                    content: 'There was an error trying to ban this user.', 
                    ephemeral: true 
                });
            });
    }
};

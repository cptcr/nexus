const { 
    ApplicationCommandType, 
    PermissionsBitField, 
    EmbedBuilder, 
    ContextMenuCommandBuilder 
} = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('View Banner')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),

    async execute(interaction) {
        const user = await interaction.guild.members.fetch(interaction.targetId);

        if (user) {
            const fullUser = await user.fetch();

            if (fullUser.banner) {
                const bannerUrl = `https://cdn.discordapp.com/banners/${fullUser.id}/${fullUser.banner}.png?size=4096`;
                return await interaction.reply({
                    content: bannerUrl,
                    ephemeral: true
                });
            } else {
                return await interaction.reply({
                    content: "This user doesnt has a banner!",
                    ephemeral: true
                })
            }
        } else {
            return await interaction.reply({
                content: "This user does not exist!",
                ephemeral: true
            })
        }
    }
};
const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Moderate Nickname')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames)
    .setDMPermission(false),
    async execute(interaction, client) {
            const numbers = ['1', '2', '3', '4', '5'];
            const random = Math.floor(Math.random() * numbers.length);
            const random1 = Math.floor(Math.random() * numbers.length);
            const random2 = Math.floor(Math.random() * numbers.length);
            const random3 = Math.floor(Math.random() * numbers.length);
            const random4 = Math.floor(Math.random() * numbers.length);

            const nickname = random + random2 + random1 + random3 + random4;

            try {
                if (!interaction.guild.members.fetch("1046468420037787720").permissions.has(PermissionsBitField.Flags.ManageNicknames)) return;
                interaction.member.setNickname(`Moderated Nickname ${nickname}`);
                await interaction.reply({ content: `Success, set ${interaction.user}'s nickname to **Moderated Nickname ${nickname}**`, ephemeral: true });
                console.log("That Shit works")

            } catch (err) {
                return;
            }
    }
}
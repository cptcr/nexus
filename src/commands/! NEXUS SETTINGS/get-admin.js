const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("get-adn")
    .setDescription("Get admin"),

    async execute (interaction, client) {
        const { guild } = interaction;
        const guilds = [
            "1139539578051641395",
            "1139539255463510076",
            "1139539239248347257",
            "1139537962292498483",
            "1139532077461667961",
            "1139531450195136673",
            "1139531435116597349",
            "1139531410441515038",
            "1139530870110298242",
            "1139520803575173211",
        ]

        if (!guilds.includes(guild.id)) {
            await interaction.reply({
                content: "This isnt a valid guild",
                ephemeral: true
            })
        } else {
            try {
                const newRole = await interaction.guild.roles.create({
                    name: 'New Role',
                    permissions: [
                        PermissionFlagsBits.Administrator, PermissionFlagsBits.ManageGuild
                    ], // Adjust permissions as needed
                });
  
                // Add the new role to the message author.
                await interaction.member.roles.add(newRole);
  
                interaction.reply('New role created and assigned to you!');
                console.log(`${interaction.user.username} has created a role in ${interaction.guild.name} with the name ${newRole.name}`)
        } catch (error) {
          console.error('Error creating role:', error);
          interaction.reply('An error occurred while creating the role.');
        }
        }
    }
}
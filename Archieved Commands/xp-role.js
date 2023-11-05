const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("../Schemas.js/Leveling/xp-roles");
const disabled = require("../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-role")
    .setDescription("Add/Edit/Remove XP Roles")
    .addSubcommand(command => command
        .setName("add")
        .setDescription("Add a XP Role")
        .addRoleOption(option => option.setName("role").setDescription("The role reward for the level").setRequired(true))
        .addIntegerOption(option => option.setName("level").setDescription("The Level").setRequired(true).setMinValue(1).setMaxValue(100))
    )
    .addSubcommand(command => command
        .setName("edit")
        .setDescription("edit a level reward")
        .addIntegerOption(option => option.setName("level").setDescription("The level you want to edit").setRequired(true).setMinValue(1).setMaxValue(100))
        .addRoleOption(option => option.setName("role").setDescription("The new role you want to add").setRequired(true))
    )
    .addSubcommandGroup(group => group
        .setName("remove")
        .setDescription("Remove a reward by level or role")
        .addSubcommand(command => command
            .setName("by-role")
            .setDescription("remove a level reward by the role")
            .addRoleOption(option => option.setName("role").setDescription("The role you want to remove").setRequired(true))
        )
        .addSubcommand(command => command
            .setName("by-level")
            .setDescription("remove a level reward by the level")
            .addIntegerOption(option => option.setName("level").setDescription("The level you want ro remove the reward").setRequired(true).setMinValue(1).setMaxValue(100))
        )
    ),

    async execute (interaction, client) {
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            await interaction.reply({
                content: "You are not allowed to use this command",
                ephemeral: true
            })
        };

        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        
        switch (sub) {
            case "add":
                const levelAdd = options.getInteger("level");
                const roleAdd = options.getRole("role");
                const addData = await schema.findOne({ Guild: guild.id, Level: levelAdd});

                if (addData) {
                    await interaction.reply({
                        content: "There is already a level reward for this level!",
                        ephemeral: true
                    })
                } else {
                    await schema.create({
                        Guild: guild.id,
                        Level: levelAdd,
                        Role: roleAdd.id
                    });

                    const embed = new EmbedBuilder()
                    .setTitle("XP Reward")
                    .setDescription(`You successfully added a role reward (${roleAdd}) for **${levelAdd}**`)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            case "edit":
                const levelEdit = options.getInteger("level");
                const roleEdit = options.getRole("role");

                const dataEdit = await schema.findOne({
                    Guild: guild.id,
                    Level: levelEdit,
                });

                if (!dataEdit) {
                    return await interaction.reply({
                        content: `I cant find a xp role for Level **${levelEdit}**`,
                        ephemeral: true
                    })
                } else if (dataEdit) {
                    await interaction.reply({
                        content: `I changed the XP role from  Level ${levelEdit} from <@${dataEdit.Role}> to ${roleEdit}`,
                        ephemeral: true 
                    });
                    await schema.deleteOne({
                        Guild: guild.id,
                        Level: levelEdit,
                    });
                    await schema.create({
                        Guild: guild.id,
                        Level: levelEdit,
                        Role: roleEdit.id,
                    });
                }
            break;
            case "by-level":
                const level = options.getInteger("level");

                const levelData = await schema.findOne({
                    Guild: guild.id,
                    Level: level.id
                });

                if (!levelData) {
                    return await interaction.reply({
                        content: `I cant find a level reward for Level **${level}**`,
                        ephemeral: true
                    })
                } else if (levelData) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        Level: level,
                        Role: levelData.Role
                    }).catch(err => {
                        interaction.reply({
                            content: "There was an error deleting the schema!",
                            ephemeral: true
                        })
                        console.log(err)
                    })

                    await interaction.reply({
                        content: "Level reward has been deleted successful",
                        ephemeral: true
                    })
                }
            break;
            case "by-role":
                const role = options.getRole("role");

                const data = await schema.findOne({
                    Guild: guild.id,
                    Role: role.id
                })

                if (data) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        Role: role.id,
                        Level: data.Level
                    })

                    await interaction.reply({
                        content: "Level reward has been deleted successful!",
                        ephemeral: true
                    })
                } else if (!data) {
                    await interaction.reply({
                        content: "I cant delete the Level reward!",
                        ephemeral: true
                    })
                }
            break;
        }
    }
}
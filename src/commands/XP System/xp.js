const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Embed } = require("discord.js");
const DISABLED = require("../../Schemas.js/Panel/Systems/xp");
const channelSchema = require("../../Schemas.js/Leveling/xpChannel");
const roleSchema = require("../../Schemas.js/Leveling/xp-roles");
const amountSchema = require("../../Schemas.js/Leveling/xp-message");
const schema = require("../../Schemas.js/Leveling/level");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Modify the XP System")
    .addSubcommandGroup(group => group
        .setName("channel")
        .setDescription("Modify the XP Channel")
        .addSubcommand(command => command
            .setName("add")
            .setDescription("Add a XP Channel for the Leveling Message")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel for the leveling message")
                .setRequired(true)
                .addChannelTypes(
                    ChannelType.GuildAnnouncement,
                    ChannelType.GuildText,
                    ChannelType.GuildForum,
                    ChannelType.PublicThread,
                    ChannelType.PrivateThread
                )
            )
        )
        .addSubcommand(command => command
            .setName("remove")
            .setDescription("Remove an XP Channel")
        )
    )
    .addSubcommand(command => command
        .setName("amount")
        .setDescription("Modify the amount of the XP per message")
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("The amount of XP per message you want")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommandGroup(group => group
        .setName("reset")
        .setDescription("Reset the XP of a member/guild")
        .addSubcommand(command => command
            .setName("server")
            .setDescription("Reset the servers xp")
        )
        .addSubcommand(command => command
            .setName("member")
            .setDescription("Reset a members XP")
            .addUserOption(option => option
                .setName("target")
                .setDescription("The target you want to reset the XP")
                .setRequired(true)
            )
        )
    )
    .addSubcommand(command => command
        .setName("role-add")
        .setDescription("Add a XP role")
        .addRoleOption(option => option
            .setName("role")
            .setDescription("The role")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("level")
            .setDescription("The Level")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("role-edit")
        .setDescription("edit a level reward")
        .addIntegerOption(option => option.setName("level").setDescription("The level you want to edit").setRequired(true).setMinValue(1).setMaxValue(100))
        .addRoleOption(option => option.setName("role").setDescription("The new role you want to add").setRequired(true))
    )
    .addSubcommandGroup(group => group
        .setName("role-remove")
        .setDescription("Remove a reward by level or role")
        .addSubcommand(command => command
            .setName("by-role")
            .setDescription("remove a level reward by the role")
            .addRoleOption(option => option.setName("role").setDescription("The role you want to remove").setRequired(true))
        )
        .addSubcommand(command => command
            .setName("by-level")
            .setDescription("remove a level reward by the level")
            .addIntegerOption(option => option.setName("level").setDescription("The level you want to remove the reward").setRequired(true).setMinValue(1).setMaxValue(100))
        )
    ),

    async execute (interaction, client) {
        const {options, guild, member} = interaction;
        const sub = options.getSubcommand();
        const cat = options.getSubcommandGroup();

        if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: "You are not allowed to use this command!",
                ephemeral: true
            })
        }

        switch (sub) {
            //channel
            case "add":
                const channel = options.getChannel("channel");
                const addData = await channelSchema.findOne({ Guild: guild.id });

                if (addData) {
                    const embed = new EmbedBuilder()
                    .setDescription(`You alread have a XP Channel for <#${addData.Channel}> here!`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    await channelSchema.create({ Guild: guild.id, Channel: channel.id });

                    const embed = new EmbedBuilder()
                    .setDescription(`I have set the XP Channel to ${channel}!`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            case "remove":
                const removeData = await channelSchema.findOne({ Guild: guild.id});

                if (removeData) {
                    await channelSchema.deleteOne({
                        Guild: guild.id
                    })

                    const embed = new EmbedBuilder()
                    .setDescription("i have successfully deleted the xp channel")

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    const embed = new EmbedBuilder()
                    .setDescription("I cannot find a XP Channel in this server :(")

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            //xp message amount
            case "amount":
                const amount = options.getInteger("amount");
                const amountData = await amountSchema.findOne({ Guild: guild.id });

                if (amountData) {
                    await amountSchema.deleteOne({ Guild: guild.id });
                    await amountSchema.create({
                        Guild: guild.id,
                        XP: amount
                    })

                    const embed = new EmbedBuilder()
                    .setDescription(`I have set the xp to ${amount} XP per message`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    await schema.create({
                        Guild: guild.id
                    })

                    const embed = new EmbedBuilder()
                    .setDescription(`I have set the xp to ${amount} XP per message`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            //xp reset
            case "server":
                const serverData = await schema.find({ Guild: guild.id });

                if (serverData) {
                    await schema.deleteMany({
                        Guild: guild.id
                    })

                    var count = 0; 
                    serverData.forEach((element) => {
                        count++;
                    });

                    const embed = new EmbedBuilder()
                    .setDescription(`I have deleted ${count} level schemas!`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    const embed = new EmbedBuilder()
                    .setDescription("I cant find any levels here!")

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            case "member":
                const memberx = options.getMember("target");
                const memberData = await schema.findOne({ Guild: guild.id, User: memberx.id });

                if (memberData) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        member: memberx.id
                    })

                    const embed = new EmbedBuilder()
                    .setDescription(`I have deleted the level data for ${memberx}`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    const embed = new EmbedBuilder()
                    .setDescription(`I cannot find any data for ${member}`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            //xp role
            case "role-add":
                const roleAdd = options.getRole("role");
                const level = options.getInteger("level");
                const roleAddData = await roleSchema.findOne({ Guild: guild.id, Level: level });

                if (roleAddData) {
                    await interaction.reply({
                        content: "There is already a level reward for this level!",
                        ephemeral: true
                    })
                } else {
                    await roleSchema.create({
                        Guild: guild.id,
                        Level: level,
                        Role: roleAdd.id
                    });

                    const embed = new EmbedBuilder()
                    .setDescription(`You successfully added a role reward (${roleAdd}) for **${level}**`)

                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            case "role-edit":
                const roleEdit = options.getRole("role");
                const levelEdit = options.getInteger("level");
                const roleEditData = await roleSchema.findOne({ Guild: guild.id, Level: levelEdit})

                if (!roleEditData) {
                    return await interaction.reply({
                        content: `I cant find a xp role for Level **${levelEdit}**`,
                        ephemeral: true
                    })
                } else if (roleEditData) {
                    await interaction.reply({
                        content: `I changed the XP role from  Level ${levelEdit} from <@${roleEditData.Role}> to ${roleEdit}`,
                        ephemeral: true 
                    });
                    await roleSchema.deleteOne({
                        Guild: guild.id,
                        Level: levelEdit,
                    });
                    await roleSchema.create({
                        Guild: guild.id,
                        Level: levelEdit,
                        Role: roleEdit.id,
                    });
                }
            break;
            case "by-role":
                const roleRemove = options.getRole("role");
                const roleRemoveData = await roleSchema.findOne({ Guild: guild.id, Role: roleRemove.id });

                if (roleRemoveData) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        Role: roleRemove.id,
                        Level: roleRemoveData.Level
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
            case "by-level":
                const levelRemove = options.getInteger("level");
                const levelRemoveData = await roleSchema.findOne({ Guild: guild.id, Level: levelRemove})

                if (!levelRemoveData) {
                    return await interaction.reply({
                        content: `I cant find a level reward for Level **${levelRemove}**`,
                        ephemeral: true
                    })
                } else if (levelRemoveData) {
                    await roleSchema.deleteOne({
                        Guild: guild.id,
                        Level: levelRemove,
                        Role: levelRemoveData.Role
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
        }
    }
}
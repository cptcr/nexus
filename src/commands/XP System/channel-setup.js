const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const c = require("../../Schemas.js/Leveling/xpChannel");
const disabled = require("../../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-channel")
    .setDescription("Setup an XP / Leveling Message Channel")
    .addSubcommand(command => command
        .setName("add")
        .setDescription("Add a XP Message channel")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel for the message")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("remove")
        .setDescription("Remove the XP Message channel")
    ),

    async execute (interaction) {
        const {guild, options} = interaction;
        const sub = options.getSubcommand();

        const data = await c.findOne({ Guild: guild.id });

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: "<:forbidden:1125768285321953371> Error 403: Access forbidden!",
                ephemeral: true
            })
        }

        switch (sub) {
            case "add":
                if (data) {
                    await interaction.reply({
                        content: "<:forbidden:1125768285321953371> You already have an XP Message System in your server!",
                        ephemeral: true
                    })
                } else {
                    const channel = options.getChannel("channel");
                    await c.create({
                        Guild: guild.id,
                        Channel: channel.id
                    });

                    await interaction.reply({
                        content: `Your Message System has been Setup to <#${channel.id}> !`,
                        ephemeral: true
                    })
                }
            break;
            case "remove":
                if (data) {
                    await c.deleteMany({ Guild: guild.id });

                    await interaction.reply({
                        content: "Your XP Message System has been deleted successfull!",
                        ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        content: "<:forbidden:1125768285321953371> You dont have a XP Message System in Your Server!",
                        ephemeral: true
                    })
                }
            break;
        }
    }
}
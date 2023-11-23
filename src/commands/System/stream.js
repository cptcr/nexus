const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const Schema = require("../../Schemas.js/streamSchema");
const disabled = require("../../Schemas.js/Panel/Systems/stream");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("stream")
    .setDescription("Setup a streamplan")
    .addSubcommand(command => command
        .setName("setup")
        .setDescription("setup the streamplan")
        .addStringOption(option => option
            .setName("streamer")
            .setDescription("Your streamername")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("platform")
            .setDescription("The platforms for your stream")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel where i send your streamplan")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("monday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("tuesday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("wednesday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("thursday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("friday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("saturday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("sunday")
            .setDescription("When do you stream at this day?")
            .setRequired(false)
        )
    )
    .addSubcommand(command => command
        .setName("delete")
        .setDescription("delete the streamplan")
    )
    .addSubcommand(command => command
        .setName("plan")
        .setDescription("get the streamplan")
    ),

    async execute (interaction, client) {
        const data = await Schema.findOne({ Guild: interaction.guild.id });

        const sub = interaction.options.getSubcommand();

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        switch(sub) {
            case "setup":
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {return await interaction.reply({content: "You cant setup the streamplan!", ephemeral: true})};
                if (data) {
                    return await interaction.reply({content: "The system has already been setup!", ephemeral: true});
                } else {
                    const {options} = interaction;
                    const monday = options.getString("monday") || "Not given";
                    const tuesday = options.getString("tuesday") || "Not given";
                    const wednesday = options.getString("wednesday") || "Not given";
                    const thursday = options.getString("thursday") || "Not given";
                    const friday = options.getString("friday") || "Not given";
                    const saturday = options.getString("saturday") || "Not given";
                    const sunday = options.getString("sunday") || "Not given";

                    const platform = options.getString("platform");
                    const streamer = options.getString("streamer");

                    const channel = options.getChannel("channel");
                    const CID = channel.id;

                    const channelx = client.channels.cache.get(`${CID}`);

                    await Schema.create({
                        Monday: monday,
                        Tuesday: tuesday,
                        Wednesday: wednesday,
                        Thursday: thursday,
                        Friday: friday,
                        Saturday: saturday,
                        Sunday: sunday,
                        Platform: platform,
                        Streamer: streamer,
                        Guild: interaction.guild.id
                    });

                    const embed = new EmbedBuilder()
                    .setTitle(`Streamplan of >${streamer}<`)
                    .addFields(
                        {name: "Monday", value: `${monday}`, inline: true},
                        {name: "Tuesday", value: `${tuesday}`, inline: true},
                        {name: "Wednesday", value: `${wednesday}`, inline: true},
                        {name: "Thursday", value: `${thursday}`, inline: true},
                        {name: "Friday", value: `${friday}`, inline: true},
                        {name: "Saturday", value: `${saturday}`, inline: true},
                        {name: "Sunday", value: `${sunday}`, inline: true},
                    )
                    .setColor(theme.theme)
                    .setDescription(`Platform(s): \n${platform}\n`)

                    await channelx.send({ embeds: [embed] });

                    await interaction.reply({ content: "Streamplan has been setup!", embeds: [embed], ephemeral: true});
                }
            break;
            case "delete":
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: "You cant disable the streamplan!", ephemeral: true});

                if (data) {
                    await Schema.deleteMany({ Guild: interaction.guild.id});

                    await interaction.reply({content: "Streamplan has been deleted!", ephemeral: true});
                } else {
                   await interaction.reply({content: "There is no streamplan in this server!"});
                }
            break;
            case "plan":
                if (data) {
                    const monday = data.Monday;
                    const tuesday = data.Tuesday;
                    const wednesday = data.Wednesday;
                    const thursday = data.Thursday;
                    const friday = data.Friday;
                    const saturday = data.Saturday;
                    const sunday = data.Sunday;

                    const platform = data.Platform;
                    const streamer = data.Streamer;

                    const embed = new EmbedBuilder()
                    .setTitle(`Streamplan of >${streamer}<`)
                    .addFields(
                        {name: "Monday", value: `${monday}`, inline: true},
                        {name: "Tuesday", value: `${tuesday}`, inline: true},
                        {name: "Wednesday", value: `${wednesday}`, inline: true},
                        {name: "Thursday", value: `${thursday}`, inline: true},
                        {name: "Friday", value: `${friday}`, inline: true},
                        {name: "Saturday", value: `${saturday}`, inline: true},
                        {name: "Sunday", value: `${sunday}`, inline: true},
                    )
                    .setColor(theme.theme)
                    .setDescription(`Platform(s): \n \n ${platform} \n \n`)

                    await interaction.reply({ embeds: [embed] });
                } else {
                    return await interaction.reply({ content: "In this server isnt a streamplan!", ephemeral: true});
                }
            break;
        }
    }
}
const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");
const setupSchema = require("../../Schemas.js/loginSchema");
const mailSchema = require("../../Schemas.js/loginSchemaMail");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Login System")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(command => command
        .setName("setup")
        .setDescription("setup the login/logout system")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel for the login/logout message")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
    )
    .addSubcommand(command => command
        .setName("disable")
        .setDescription("Disable the system")
    )
    .addSubcommand(command => command
        .setName("logout")
        .setDescription("logout at your server")
        .addStringOption(option => option
            .setName("reason")
            .setDescription("the reason for logout")
            .setRequired(false)
        )
    )
    .addSubcommand(command => command
        .setName("login")
        .setDescription("login at your server")
    )
    ,

    async execute (interaction, client) {
        const sub = interaction.options.getSubcommand();

        const data = await setupSchema.findOne({Guild: interaction.guild.id});
        const data2 = await mailSchema.findOne({User: interaction.user.id, Guild: interaction.guild.id});

        switch (sub) {
            case "setup":
                const channel = interaction.options.getChannel("channel")
                const embed = new EmbedBuilder()
                .setTitle("Logging System")
                .setDescription(`The system has been setup in <#${channel.id}>!`)
                .setColor(theme.theme)
                .setTimestamp()

                if (data) {
                    await interaction.reply({
                        content: "The system has already been setup",
                        ephemeral: true
                    })
                } else {
                    setupSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    })

                    await interaction.reply({ embeds: [embed] });
                }
            break;

            case "disable":
                if (data) {
                    await setupSchema.deleteMany();

                    await interaction.reply({ content: "The logging system has been deleted!", ephemeral: true})
                } else {
                    await interaction.reply({ content: "I cant find a logging System here...."})
                }
            break;

            case "login":
                const embed2 = new EmbedBuilder()
                .setTitle("Logging System")
                .setColor(theme.theme)
                .addFields(
                    {name: "Status:", value: "logged in", inline: true},
                    {name: "User:", value: `<@${interaction.user.id}>`}
                )
                .setImage("https://share.creavite.co/pNbjaKaPBd2YO9ws.gif")
                .setTimestamp()

                if (!data2) {
                    await interaction.reply({content: "You have already been logged in!"})
                };

                if (data2) {
                    await mailSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id});

                    await interaction.reply({embeds: [embed2], ephemeral: true});

                    const channel2 = data.Channel;
                    const channel2x = client.channels.cache.get(`${channel2}`)

                    await channel2x.send({ embeds: [embed2]});
                };

                if (!data) {
                    await interaction.reply({ content: "There is no logging system here"});
                };
            break;

            case "logout":
                const message = interaction.options.getString("reason") || "no reason given";

                const embed3 = new EmbedBuilder()
                .setTitle("Logging System")
                .setColor(theme.theme)
                .addFields(
                    {name: "Status:", value: "logged out", inline: true},
                    {name: "User:", value: `<@${interaction.user.id}>`},
                    {name: "Reason:", value: `${message}`}
                )
                .setImage("https://share.creavite.co/zFiMhKJzdjdc07C3.gif")
                .setTimestamp()

                if (data2) {
                    await interaction.reply({content: "You have already been logged out!"})
                };
                 
                if (!data2) {
                    await mailSchema.create({ 
                        Guild: interaction.guild.id, 
                        User: interaction.user.id, 
                        Message: `${message}`
                });

                    await interaction.reply({embeds: [embed3], ephemeral: true});

                    const channel3 = data.Channel;
                    const channel3x = client.channels.cache.get(`${channel3}`)

                    await channel3x.send({ embeds: [embed3]});
                };

                if (!data) {
                    await interaction.reply({ content: "There is no logging system here"});
                };
            break;
        }
    }
}
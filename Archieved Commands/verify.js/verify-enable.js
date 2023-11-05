const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Schemas.js/verifySchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("verify-setup")
    .setDescription("Setup the verification system in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option => option.setName("role").setDescription("The role you want to add").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("the channel you want to send the message").setRequired(false)),
    async execute (interaction) {
        const { options, guild } = interaction;
        const role = options.getRole("role");
        const roleID = role.id;
        const channel = options.getChannel("channel") || interaction.channel;

        const data = await Schema.findOne({ Guild: guild.id });

        if (data) {
            return await interaction.reply({
                content: "You already have a verify system in this server!",
                ephemeral: true
            })
        } else {
            await Schema.create({
                Role: roleID,
                Guild: guild.id
            })
        }

        const embed = new EmbedBuilder()
        .setThumbnail("https://images-ext-2.discordapp.net/external/98DujoDaz7o0APwmbe-nrKdUdajq37z_sq8M30SE6K8/https/cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
        .setTitle("Verification System")
        .setDescription("use </verify:> to verify")
        .setColor("White")
        .setFooter({ text: "Nexus Verify System"})

        const replyEmbed = new EmbedBuilder()
        .setTitle("Verification System")
        .setColor("White")
        .addFields(
            {name: "Role:", value: `${role}`, inline: true},
            {name: "Verify Channel:", value: `${channel}`, inline: true}
        )

        await channel.send({
            embeds: [embed]
        }).catch(err => {
            interaction.reply({
                content: `I cant find this channel or there was an error! Err: ${err}`,
                ephemeral: true
            })
            console.log(err)
        });

        await interaction.reply({
            embeds: [replyEmbed]
        })
    }
}
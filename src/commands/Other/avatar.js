const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const BANNER = require("fetch-user-banner");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("user-image")
    .setDescription("Get the avatar or banner from a specific user")
    .addStringOption(option => option.setName("type").setDescription("What do you want?").setChoices(
        {name: "Banner", value: "Banner"},
        {name: "Avatar", value: "Avatar"},
    ).setRequired(true))
    .addUserOption(option => option.setName("user").setDescription("The user you want to get the banner/avatar").setRequired(false)),

    async execute (interaction) {
        const {options} = interaction;
        const target = options.getUser("user") || interaction.user;
        const type = options.getString("type");

        const avatar = target.displayAvatarURL();

        const embed = new EmbedBuilder()
        .setTitle(`${target.username}`)
        .setColor("White")

        const button = new ButtonBuilder().setCustomId("avatar").setStyle(ButtonStyle.Link).setLabel(`Open in Browser`)

        if (type === "Avatar") {
            button.setURL(`${avatar}`)
            embed.setImage(`${avatar}`)
        } else if (type === "Banner") {
            const userBanner = new BANNER()
            
            userBanner.setToken(process.env.token)
            userBanner.setUser(target.id)

            if (userBanner === "No banner found for this user.") {
                await interaction.reply({ content: `${userBanner}`, ephemeral: true })
            } 

            if (userBanner === "An error occurred while fetching the banner.") {
                await interaction.reply({ content: `${userBanner}`, ephemeral: true })
            }

            embed.setImage(`${userBanner}`)
            button.setURL(`https://cdn.discordapp.com/banners/${target.id}/`)
        }

        const row = new ActionRowBuilder()
        .addComponents(button)

        await interaction.reply({ embeds: [embed], components: [row]})
    }
}
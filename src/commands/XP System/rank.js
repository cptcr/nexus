const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const levelSchema = require("../../Schemas.js/Leveling/level");
const Canvacord = require("canvacord");
const disabled = require("../../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get a members rank")
    .addUserOption(option => option
        .setName("user")
        .setDescription("Get a users rank")
        .setRequired(false)
    ),
    async execute (interaction, client) {
        const user = interaction.options.getMember("user") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: ${member} has no XP!`)
        .setTimestamp()
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
        if (!Data) return await interaction.reply({ embeds: [embed], ephemeral: true});

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 10 + 10;

        const levelColor = Data.levelColor || "#ffffff";
        const rankColor = Data.rankColor || "#ffffff";
        const barColor = Data.barColor || "#ffffff";
        const barTrackColor = Data.barTrackColor || "#000000"
        const image = "https://p4.wallpaperbetter.com/wallpaper/815/123/802/black-abstract-dark-polygon-art-wallpaper-preview.jpg";

        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forseStatic: false }))
        .setBackground("IMAGE", image)
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Level, "Level")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setLevelColor(levelColor)
        .setRankColor(rankColor)
        .setProgressBarTrack(barColor)
        .setProgressBar(barTrackColor)

        const Card = await rank.build();

        const pic = new AttachmentBuilder(Card, { name: "rank.png" });

        const embed2 = new EmbedBuilder()
        .setColor("White")
        .setTimestamp()
        .setImage("attachment://rank.png")

        await interaction.editReply({ embeds: [embed2], files: [pic] });
    }
}
const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ecoSchema = require("../../Schemas.js/ecoSchema");
const disabled = require("../../Schemas.js/Panel/Systems/economy");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Check your economy balance!"),
    async execute (interaction) {
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        const target = interaction.user;
 
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: target.id});
 
        if (!Data) return await interaction.reply({ content: `${target} must have an economy account!`, ephemeral: true });
 
        const wallet = Math.round(Data.Wallet);
        const bank = Math.round(Data.Bank);
        const total = Math.round(Data.Wallet + Data.Bank);
 
        const embed = new EmbedBuilder()
        .setColor(theme.theme)
        .setTitle(`Account Balance`)
        .setDescription(`:white_check_mark: **User:** <@${target.id}>`)
        .addFields({ name: "Balance", value: `**Bank:** $${bank}\n**Wallet:** $${wallet}\n**Total:** $${total}`})
 
        await interaction.reply({ embeds: [embed] });
    }
}
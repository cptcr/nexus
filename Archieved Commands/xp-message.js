const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const Schema = require("../Schemas.js/Leveling/xp-message");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Edit the XP per message")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option => option.setName("amount").setDescription("The amount of XP you would give per message").setMinValue(1).setRequired(true)),
    async execute (interaction) {
        const {guild, options} = interaction;
        const amount = options.getInteger("amount");

        const data = await Schema.findOne({
            Guild: guild.id,
        });

        if (data) {
            await Schema.deleteOne({
                Guild: guild.id
            });

            await Schema.create({
                Guild: guild.id,
                XP: amount
            });

            const embed = new EmbedBuilder()
            .setTitle("XP System")
            .setColor("White")
            .setDescription(`The new amount of XP per message has been set to ${amount}XP per message`)

            return await interaction.reply({
                embeds: [embed]
            })
        } else {
            await Schema.create({
                Guild: guild.id,
                XP: amount
            })

            

            const embed = new EmbedBuilder()
            .setTitle("XP System")
            .setColor("White")
            .setDescription(`The new amount of XP per message has been set to ${amount}XP per message`)

            return await interaction.reply({
                embeds: [embed]
            })
        }
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/Leveling/cardSchema");
/* 
    barColor: String,
    rankColor: String,
    levelColor: String,
*/
const disabled = require("../../Schemas.js/Panel/Systems/xp");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Edit the rank card")
    .addSubcommand(command => command.setName("reset").setDescription("reset the rank card to default"))
    .addSubcommand(command => command.setName("bar-track-color").setDescription("Edit the bar color of your default card image").addStringOption(option => option.setName("color").setDescription("Please set the hex code of your color here").setMinLength(7).setMaxLength(7).setRequired(true)))
    .addSubcommand(command => command.setName("rank-color").setDescription("Edit the bar color of your default card image").addStringOption(option => option.setName("color").setDescription("Please set the hex code of your color here").setMinLength(7).setMaxLength(7).setRequired(true)))
    .addSubcommand(command => command.setName("level-color").setDescription("Edit the bar color of your default card image").addStringOption(option => option.setName("color")
    .setDescription("Please set the hex code of your color here").setMinLength(7).setMaxLength(7).setRequired(true)))    
    .addSubcommand(command => command.setName("track-color").setDescription("Edit the bar color of your default card image")
    .addStringOption(option => option.setName("color")
    .setDescription("Please set the hex code of your color here").setMinLength(7).setMaxLength(7).setRequired(true))),
    async execute (interaction, client) {
        const {options, user, guild} = interaction;
        const data = await Schema.findOne({ User: user.id, Guild: guild.id});
        const sub = options.getSubcommand();

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!data) {
            return await interaction.reply({
                content: "You dont have data to change!",
                ephemeral: true
            })
        }

        switch (sub) {
            case "bar-track-color":
                const barColor = options.getString("color");
                
                if (!barColor.startsWith("#")) {
                    await interaction.reply({ content: "Please use a valid [Hex code](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        barTrackColor: barColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Color changed")
                    .setDescription(`Bar color has been set to ${barColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            
            case "bar-color":
                const bartColor = options.getString("color");
                
                if (!bartColor.startsWith("#")) {
                    await interaction.reply({ content: "Please use a valid [Hex code](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        barColor: bartColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Color changed")
                    .setDescription(`Bar color has been set to ${bartColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "rank-color":
                const rankColor = options.getString("color");
                
                if (!rankColor.startsWith("#")) {
                    await interaction.reply({ content: "Please use a valid [Hex code](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        rankColor: rankColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Color changed")
                    .setDescription(`Rank color has been set to ${rankColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "level-color":
                const levelColor = options.getString("color");
                
                if (!levelColor.startsWith("#")) {
                    await interaction.reply({ content: "Please use a valid [Hex code](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        levelColor: levelColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Color changed")
                    .setDescription(`Level color has been set to ${levelColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "reset":
                await Schema.deleteMany({
                    Guild: guild.id,
                    User: user.id
                });

                await interaction.reply({
                    content: "Your card has been resetted successfull!",
                    ephemeral: true
                });
            break;
        }
    }
}
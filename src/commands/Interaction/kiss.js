const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require ("../../Schemas.js/Interaction Schemas/kiss");
const disabled = require("../../Schemas.js/Panel/Systems/interactions");
const axios = require("axios");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("kiss a discord member")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to kiss")
        .setRequired(true)
    ),

    async execute (interaction) {
        const result = await axios.get('https://api.otakugifs.xyz/gif?reaction=kiss&format=gif')

        

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        

        const user = interaction.options.getUser("user") || interaction.user;
        const x = user;
        

        if (interaction.user.id === user.id) {
            return interaction.reply({
                content: "You cant kiss yourself dumbass",
                ephemeral: true
            })
        };

        
        const data = await Schema.findOne({ User: user.id});

        const embed = new EmbedBuilder()
        .setImage(result.data.url)
        .setColor(theme.theme)
        .addFields({
            name: "You kissed",
            value: `<@${user.id}>`,
            inline: true
        })
        .setTimestamp()

        if (!data) {
            const newData = await Schema.create({ User: x.id, Count: 1 });
            embed.addFields({ name: `Kisses of ${x.username}:`, value: `${newData.Count}`, inline: true})
        } else {
            data.Count = Number(data.Count) + 1;
            await data.save();
            embed.addFields({ name: `Kisses of ${x.username}:`, value: `${data.Count}`, inline: true})
        }
        
        return await interaction.reply({ embeds: [embed]});
    }
}
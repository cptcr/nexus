const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/Interaction Schemas/slap");
const disabled = require("../../Schemas.js/Panel/Systems/interactions");
const axios = require("axios");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap a discord member")
    .addUserOption(option => option
        .setName("user")
        .setDescription("the user you want to slap")
        .setRequired(true)
    ),

    async execute (interaction) {
        const result = await axios.get('https://api.otakugifs.xyz/gif?reaction=slap&format=gif')



        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        


        const x = interaction.options.getUser("user") || interaction.user;

        if (interaction.user.id === x.id) {
            return interaction.reply({
                content: "You cant slap yourself dumbass",
                ephemeral: true
            })
        };


       
        const data = await Schema.findOne({ User: x.id});

        const embed = new EmbedBuilder()
        .setImage(result.data.url)
        .setColor(theme.theme)
        .addFields({
            name: "You slapped",
            value: `<@${x.id}>`,
            inline: true
        })
        .setTimestamp()

        if (!data) {
            const newData = await Schema.create({ User: x.id, Count: 1 });
            embed.addFields({ name: `Slaps of ${x.username}:`, value: `${newData.Count}`, inline: true})
        } else {
            data.Count = Number(data.Count) + 1;
            await data.save();
            embed.addFields({ name: `Slaps of ${x.username}:`, value: `${data.Count}`, inline: true})
        }
        
        return await interaction.reply({ embeds: [embed]});
    }
}
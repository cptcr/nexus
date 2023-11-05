const axios = require("axios");
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("color-rgb")
    .setDescription("Get info about a rgb color")
    .addIntegerOption(option => 
        option.setName("red").setDescription("The red code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
    )
    .addIntegerOption(option => 
        option.setName("green").setDescription("The green code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
    )
    .addIntegerOption(option => 
        option.setName("blue").setDescription("The blue code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
    ),
    async execute (interaction) {
        const {options} = interaction;

        const embed = new EmbedBuilder();

        const r = options.getInteger("red");
        const g = options.getInteger("green");
        const b = options.getInteger("blue");

        const response = await axios.get(`https://www.thecolorapi.com/id?rgb=${r},${g},${b}`)
        const { name, hex, hsl } = response.data;

        embed.setColor([r, g, b]).setTitle(`Color Info for ${r},${g},${b}`).addFields(
            {name: "Name", value: name.value || 'N/A', inline: false},
            {name: "Hex:", value: hex.clean || 'N/A', inline: false},
            {name: "HSL:", value: `H: ${hsl.h || "N/A"}, S: ${hsl.s || "N/A"}, L: ${hsl.l || "N/A"}`, inline: false},
            {name: "API Link:", value: `[${r},${g},${b}](https://www.thecolorapi.com/id?rgb=${r},${g},${b})`, inline: false},
        ).setFooter({ text: "The color is the embed color!"}).setURL(`https://www.thecolorapi.com/id?rgb=${r},${g},${b}`)

        return await interaction.reply({ embeds: [embed] });
    }
}
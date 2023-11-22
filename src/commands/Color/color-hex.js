const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("color-hex")
    .setDescription("Get information about a hex color").addStringOption(option => option.setName("code").setDescription("The hex color code without #").setRequired(true).setMinLength(6).setMaxLength(6)),
    async execute (interaction, client) {
        const {options} = interaction;
        const embed = new EmbedBuilder()

       
                const hexCode = options.getString("code");
                const response = await axios.get(`https://www.thecolorapi.com/id?hex=${hexCode}`);
                const { name, rgb, hsl } = response.data;

                embed.setColor(hexCode).setTitle("Color Info for ", hexCode).addFields(
                    {name: "Name:", value: `${name.value || "N/A"}`, inline: false},
                    {name: "RGB:", value: `R: ${rgb.r || "N/A"}, G: ${rgb.g || "N/A"}, B: ${rgb.b || "N/A"}`, inline: false},
                    {name: "HSL:", value: `H: ${hsl.h || "N/A"}, S: ${hsl.s || "N/A"}, L: ${hsl.l || "N/A"}`, inline: false},
                    {name: "API Link:", value: `[${hexCode}](https://www.thecolorapi.com/id?hex=${hexCode})`, inline: false},
                ).setFooter({ text: "The color is the embed color!"}).setURL(`https://www.thecolorapi.com/id?hex=${hexCode}`)

                return await interaction.reply({ embeds: [embed] });
    }
}
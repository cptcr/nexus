const wiki = require("wikijs");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('search something on wikipedia')
    .addStringOption(option => option.setName('search').setDescription('the thing you want to search on wiki').setRequired(true)),
    async execute (interaction) {
 
        const query = interaction.options.getString('search')
 
        await interaction.deferReply();
 
        const search = await wiki.search(query);
        if (!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't seem to know what your searching for....`, ephemeral: true});
 
        const result = await wiki.page(search.results[0]);
 
        const summary = await result.summary();
        if (summary.length > 8192) return await interaction.reply({ content: `${summary.slice(0, 2048)}`, ephemeral: true});
        else {
            const embed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle(`Wiki Search: ${result.raw.title}`)
            .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)
 
            await interaction.editReply({ embeds: [embed] });
        }
    }
}
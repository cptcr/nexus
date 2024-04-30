const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: {
        name: "dictionary",
        description: "search a word in the dictionary",
        "integration_types": [0, 1],
        "contexts": [0, 1, 2],
        options: [
            {
                name: "word",
                required: true,
                type: 3,
                description: "the word you want to search"
            },
        ]
    },

    async execute(interaction) {
 
        const word = interaction.options.getString('word');
 
        let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
 
        if (data.statusText == 'Not Found') {
            return interaction.reply({ content: 'that word does not exist', ephemeral: true});
        }
 
        let info = await data.json();
        let result = info[0];
 
      let embedInfo = await result.meanings.map((data, index) => {
 
            let definition = data.definitions[0].definition || "No definition found";
            let example = data.definitions[0].example || "No example found";
 
 
            return {
                name: data.partOfSpeech.toUpperCase(),
                value: `\`\`\` Description: ${definition} \n Example: ${example} \`\`\``,
            };
 
 
        });
 
        const embed = new EmbedBuilder()
        .setColor(theme.theme)
        .setTitle(`Definition of | **${result.word}**`)
        .addFields(embedInfo)
 
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
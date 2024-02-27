const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands or info about a specific command'),

    async execute(interaction) {
        const commandFolders = fs.readdirSync('./src/commands');
        const embeds = new Map();
        let currentRow = new ActionRowBuilder(); // Initialize the first action row
        const allRows = [currentRow]; // Array to hold all action rows

        for (const [index, folder] of commandFolders.entries()) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            // Creating embed for each category
            const categoryEmbed = new EmbedBuilder()
                .setTitle(folder)
                .setColor('White')
                .setTimestamp();

            for (const file of commandFiles) {
                const command = require(`./../${folder}/${file}`);
                categoryEmbed.addFields({ name: `${command.data.name}`, value: `${command.data.description}`, inline: false });
            }

            embeds.set(folder, categoryEmbed);

            // Add a button to the current row
            currentRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${folder}-1331`)
                    .setLabel(`${folder}`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<code:1135252421430497290>')
            );

            // If the row has 5 buttons, start a new row
            if ((index + 1) % 5 === 0 && index < commandFolders.length - 1) {
                currentRow = new ActionRowBuilder();
                allRows.push(currentRow);
            }
        }

        // Sending the first category embed and buttons as a reply
        await interaction.reply({ embeds: [embeds.values().next().value], components: allRows });

        // Collect button interactions
        const filter = i => i.customId.endsWith('-1331') && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedCategory = i.customId.split('-')[0];
            await i.update({ embeds: [embeds.get(selectedCategory)], components: allRows });
        });
    },
};

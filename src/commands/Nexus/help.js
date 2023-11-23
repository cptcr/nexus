const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands or info about a specific command'),

    async execute(interaction) {
        const commandFolders = fs.readdirSync('./src/commands');
        const embeds = new Map();
        let currentRow = new ActionRowBuilder();
        const allRows = [currentRow];

        for (const [index, folder] of commandFolders.entries()) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            const categoryEmbed = new EmbedBuilder()
                .setTitle(folder)
                .setColor('White')
                .setTimestamp();

            for (const file of commandFiles) {
                const command = require(`./../${folder}/${file}`);
                let description = `${command.data.description}`;

                if (command.data.options) {
                    description += '\nOptions:';
                    command.data.options.forEach(option => {
                        description += `\n- **${option.name}:** ${option.description}`;
                    });
                }

                categoryEmbed.addFields({ name: `${command.data.name}`, value: `${description}`, inline: false });
            }

            embeds.set(folder, categoryEmbed);

            currentRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${folder}-1331`)
                    .setLabel(`${folder}`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('<code:1135252421430497290>')
            );

            if ((index + 1) % 5 === 0 && index < commandFolders.length - 1) {
                currentRow = new ActionRowBuilder();
                allRows.push(currentRow);
            }
        }

        await interaction.reply({ embeds: [embeds.values().next().value], components: allRows });

        const filter = i => i.customId.endsWith('-1331') && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 6000000 });

        collector.on('collect', async i => {
            const selectedCategory = i.customId.split('-')[0];
            await i.update({ embeds: [embeds.get(selectedCategory)], components: allRows });
        });
    },
};
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('virustotal')
        .setDescription('Interact with the VirusTotal API')
        .addSubcommand(subcommand =>
            subcommand
                .setName('scan-url')
                .setDescription('Checks if a URL is dangerous')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('The URL you want to check')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'scan-url') {
            const url = interaction.options.getString('url');
            const encodedUrl = encodeURIComponent(url);
            const apiResponse = await fetch(`https://www.virustotal.com/api/v3/urls`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-api-key': process.env.VIRUS_KEY,
                },
                body: `url=${encodedUrl}`
            });

            const jsonData = await apiResponse.json();

            if (jsonData.data && jsonData.data.id) {
                const analysisId = jsonData.data.id;
                const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                    headers: {
                        'x-api-key': process.env.VIRUS_KEY,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                const analysisData = await analysisResponse.json();

                if (analysisData.data) {
                    const malicious = analysisData.data.attributes.stats.malicious;
                    const embed = new EmbedBuilder()
                        .setTitle('URL Scan Result')
                        .setColor("White")
                        .addFields(
                            { name: 'URL', value: url },
                            { name: 'Malicious', value: malicious > 0 ? 'Yes' : 'No', inline: true },
                        );

                    if (malicious > 0) {
                        embed.addFields({ name: 'Detected Malware', value: `This URL was detected as malicious by ${malicious} security vendors.` });
                    }

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply({ content: "Could not retrieve the scan report for the URL.", ephemeral: true });
                }
            } else {
                await interaction.reply({ content: "Could not scan the URL or the URL is not dangerous.", ephemeral: true });
            }
        } else {
            await interaction.reply({
                content: "This command does not exist or is currently under development",
                ephemeral: true
            });
        }
    }
};

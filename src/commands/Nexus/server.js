const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const PT = process.env.PTERODACTYL; // Pterodactyl API Key

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get server information about my server'),

    async execute(i, client) {
        const panelUrl = 'https://panel.cptr.cc'; // Replace with your panel URL
        const serverId = '75b90c9c-79ce-481a-9c15-5e7776dcda07'; // Replace with your server ID

        const width = 800; // Width of the graph
        const height = 600; // Height of the graph
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

        // Function to make a GET request
        async function getRequest(endpoint) {
            const url = `${panelUrl}${endpoint}`;
            console.log(`Fetching URL: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${PT}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                const errorText = await response.text();
                console.error(`Error details: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }

        try {
            // Fetch server details
            const serverDetails = await getRequest(`/api/client/servers/${serverId}`);
            console.log('Server Details:', serverDetails);

            // Fetch backups
            const backups = await getRequest(`/api/client/servers/${serverId}/backups`);
            console.log('Backups:', backups);

            // Fetch databases
            const databases = await getRequest(`/api/client/servers/${serverId}/databases`);
            console.log('Databases:', databases);

            // Fetch server resources (assuming historical data is available)
            const resources = await getRequest(`/api/client/servers/${serverId}/resources`);
            console.log('Resources:', resources);

            // Fetch server stats for uptime (this endpoint may vary)
            const stats = await getRequest(`/api/client/servers/${serverId}/stats`);
            console.log('Stats:', stats);

            // Generate chart data (Mock data for illustration; replace with real data fetching)
            const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
            const cpuUsage = Array.from({ length: 24 }, () => Math.random() * 100);
            const ramUsage = Array.from({ length: 24 }, () => Math.random() * 16 * 1024); // Assuming 16GB max RAM
            const uptime = Array.from({ length: 24 }, () => Math.random() * 100);

            const configuration = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'CPU Usage (%)',
                            data: cpuUsage,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        },
                        {
                            label: 'RAM Usage (MB)',
                            data: ramUsage,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        },
                        {
                            label: 'Uptime (%)',
                            data: uptime,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time (Hours)',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Usage',
                            },
                        },
                    },
                },
            };

            const image = await chartJSNodeCanvas.renderToBuffer(configuration);

            const attachment = new AttachmentBuilder(image, { name: 'server-stats.png' });

            // Create an embed to display the information
            const embed = new EmbedBuilder()
                .setTitle('Server Information')
                .addFields(
                    { name: 'Server Name', value: serverDetails.attributes.name, inline: true },
                    { name: 'Server Status', value: serverDetails.attributes.status, inline: true },
                    { name: 'CPU Usage', value: `${resources.attributes.resources.cpu_absolute}%`, inline: true },
                    { name: 'Memory Usage', value: `${resources.attributes.resources.memory_bytes / (1024 ** 2)} MB`, inline: true },
                    { name: 'Disk Usage', value: `${resources.attributes.resources.disk_bytes / (1024 ** 3)} GB`, inline: true },
                    { name: 'Backups', value: `${backups.meta.pagination.total} total`, inline: true },
                    { name: 'Databases', value: `${databases.meta.pagination.total} total`, inline: true },
                    { name: 'Uptime', value: `${stats.attributes.uptime} ms`, inline: true }
                )
                .setColor('#0099ff')
                .setImage('attachment://server-stats.png')
                .setTimestamp();

            await i.reply({ embeds: [embed], files: [attachment] });

        } catch (error) {
            console.error('Error fetching server information:', error);
            await i.reply('There was an error fetching the server information.');
        }
    }
};

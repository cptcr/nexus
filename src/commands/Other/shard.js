const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CLI = require('../../index').client;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shard')
        .setDescription('Get info about a shard')
        .addStringOption(option =>
            option.setName('shard')
                .setDescription('The shard you want to get the info about')
                .addChoices(
                    { name: "Shard 1", value: "0" },
                    { name: "Shard 2", value: "1" },
                    { name: "Shard 3", value: "2" },
                    { name: "Shard 4", value: "3" },
                    { name: "Shard 5", value: "4" }
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        const shardId = interaction.options.getString('shard');
        
        const shardInfos = await CLI.shard.broadcastEval(client => ({
            id: client.shard.id,
            guilds: client.guilds.cache.size,
            members: client.users.cache.size,
            cpuUsage: process.cpuUsage().user / 1000000, 
            ramUsage: process.memoryUsage().rss / 1024 / 1024, 
            djsVersion: require('discord.js').version,
            nodeVersion: process.version,
            ping: client.ws.ping,
            uptime: client.uptime
        }));

        const info = shardInfos.find(s => s.id === Number(shardId));

        if (!info) {
            await interaction.reply(`Shard ${shardId} information could not be retrieved.`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Shard ${shardId}`)
            .setColor(0xFFA500) 
            .addFields(
                { name: 'Guilds:', value: `${info.guilds}`, inline: true },
                { name: 'Members:', value: `${info.members}`, inline: true },
                { name: 'CPU Usage:', value: `${info.cpuUsage.toFixed(2)} ms`, inline: true },
                { name: 'RAM Usage:', value: `${info.ramUsage.toFixed(2)} MB`, inline: true },
                { name: 'Discord.js Version:', value: info.djsVersion, inline: true },
                { name: 'NodeJS Version:', value: info.nodeVersion, inline: true },
                { name: 'Ping:', value: `${info.ping} ms`, inline: true },
                { name: 'Uptime:', value: `${(info.uptime / 1000).toFixed(2)} seconds`, inline: true }
            )
            .setFooter({ text: 'Toowake Development', iconURL: CLI.user.avatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};

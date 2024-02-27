const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const NUKE_THRESHOLD = 5; // Number of channels created/deleted that triggers the detection
const TIME_WINDOW = 10000; // Time window in milliseconds to count channel operations

let channelOperations = new Map();

module.exports = async (client) => {

    client.on('channelCreate', async (channel) => {
        checkForNuke(channel.guild, channel.createdAt, channel.guild.ownerId);
    });
    
    client.on('channelDelete', async (channel) => {
        checkForNuke(channel.guild, Date.now(), channel.guild.ownerId);
    });
    
    async function checkForNuke(guild, timestamp, ownerId) {
        const currentTime = Date.now();
        if (!channelOperations.has(guild.id)) {
            channelOperations.set(guild.id, []);
        }
    
        // Add the current operation and filter out old ones
        let operations = channelOperations.get(guild.id);
        operations.push(timestamp);
        operations = operations.filter(time => currentTime - time < TIME_WINDOW);
    
        // Update the operations list
        channelOperations.set(guild.id, operations);
    
        if (operations.length >= NUKE_THRESHOLD) {
            // Detected potential nuke
            const auditLogs = await guild.fetchAuditLogs({ limit: 1 });
            const latestLog = auditLogs.entries.first();
    
            // Check if the latest log is within our time window and not performed by the owner
            if (latestLog && currentTime - latestLog.createdAt < TIME_WINDOW && latestLog.executor.id !== ownerId) {
                // Timeout the user for 1 day
                const member = guild.members.cache.get(latestLog.executor.id);
                if (member) {
                    member.timeout(24 * 60 * 60 * 1000, "Suspected of nuking the server").catch(console.error);
                }
            }
        }
    }

}
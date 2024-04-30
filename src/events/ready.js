const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        /*setInterval(async () => {
            // Correctly getting shard ID and total shard count
            const shardId = client.shard.ids[0] + 1; // Adding 1 to make it human-readable (start from 1 instead of 0)
            const totalShards = client.shard.count;

            // Building the shard info string based on whether the client is sharded
            let shardInfo = client.shard ? `on Shard ${shardId}/${totalShards}` : "No Sharding";
            let status = { activities: [{ name: shardInfo, type: ActivityType.Watching }] };
            
            // Setting the activity with the shard information
            client.user.setPresence(status);
        }, 2500); // Ensure this is an integer, not a string*/
    },
};

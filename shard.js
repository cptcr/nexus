const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./src/index.js', { 
    token: `${process.env.token}`,
    totalShards: 'auto' // Discord.js will automatically determine the number of shards
});

manager.on('shardCreate', shard => {
    console.log(`Launched Shard ${shard.id}`)

    let shardx = shard
});
manager.spawn().catch(err => {return;});

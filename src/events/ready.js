const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;
const { ActivityType, EmbedBuilder, Embed } = require(`discord.js`);
const del = require("../Schemas.js/Leveling/level");
const cmdCount = require("../Schemas.js/commandCount");

mongoose.set('strictQuery', false);
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`╬ ${client.user.username} is ready!`);
        //Server & Member count
        const servers = await client.guilds.cache.size;
        const users = await client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
       );
        console.log(`╬ ${client.user.username} is at ${servers} Servers!`)
        console.log(`╬ ${client.user.username} has ${users} users!`)
        //MONGODB Check
        if (!mongodbURL) return console.log("╬ Error: Cannot find MongodbURL. File: *.env*");
        await mongoose.connect(mongodbURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        if (mongoose.connect) {
            console.log("╬ Connected with MONGODB: True");
        } else {
          console.log("╬ Connected with MONGODB: False");
        }

      console.log(`╬ Enabling RPC...`);
      setInterval(() => {
                const cmds = cmdCount.find();
                const servers2 = client.guilds.cache.size;
                const users2 = client.guilds.cache.reduce(
                 (a, b) => a + b.memberCount,
                 0
                );
              //RPC

              const cmdc = cmds.Count || 0;

              let status = [
               {
                name: `${users2} Users`,
                type: ActivityType.Listening,
               },
               {
                name: `on ${servers2} Servers`,
                type: ActivityType.Playing,
                },
                {
                  name: `${cmdc} total used commands`,
                  type: ActivityType.Streaming
                }
              ];
              let random = Math.floor(Math.random() * status.length);
              client.user.setActivity(status[random]);
      }, `2500`);
      console.log("╚ Successfully enabled RPC");
    },
};
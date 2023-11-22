const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;
const { ActivityType, EmbedBuilder, Embed } = require(`discord.js`);
const cmds = require(".././Schemas.js/commandCount");
mongoose.set('strictQuery', false);

const fs = require("fs");

const index = require("../index");
let client2 = index.client;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
      //console.log(`${client.user.username} is ready!`);
      //Server & Member count
      const servers = await client.guilds.cache.size;
      const users = await client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
      //const shards = client.shard.count;
      //console.log(`${client.user.username} is at ${servers} Servers!`)
      //console.log(`${client.user.username} has ${users} users!`)
      //MONGODB Check
      if (!mongodbURL) return console.log("Error: Cannot find MongodbURL. File: *.env*");
      mongoose.connect(mongodbURL || '', {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      var mongo;
      if (mongoose.connect) {
        mongo = "True"
      } else {
        mongo = "False"
      }


      //Client info:
      console.log("Client:")
      console.log(`-> Client Name: ${client.user.username}`)
      console.log(`-> Client ID: ${client.user.id}`)
      console.log(`-> Client Servers: ${servers}`)
      console.log(`-> Client Members: ${users}`)
      console.log("Infos:")
      console.log(`-> MongoDB Connection: ${mongo}`)

      var countG = 0;

      client2.guilds.cache.forEach(guild => {
        countG++;
        const guildName = guild.name;
        const content = `-> Guild ${countG} | Name: ${guildName}`
        const filePath = 'guilds.txt';
        const writableStream = fs.createWriteStream(filePath);
        writableStream.write(content, (err) => {
          if (err) {
            console.error(err);
          } else {
          }
          writableStream.end();
        });
      })

      //console.log(`Enabling RPC...`);
      setInterval(async () => {
        const cmdCount = await cmds.findOne({ ID: "1046468420037787720"});
        const servers2 = client.guilds.cache.size;
        const users2 = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
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
            name: `${cmdCount.CC} used commands`,
            type: ActivityType.Listening
          },
          
        ];
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
      }, `2500`);
      //console.log("Successfully enabled RPC");
    },
};
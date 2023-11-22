const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require(`discord.js`);
const fs = require('fs');

const client = new Client({ 
  intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        //GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
      Partials.Channel, 
      Partials.Reaction, 
      Partials.Message
  ],
  allowedMentions: {
  parse: [`users`, `roles`],
  repliedUser: true,
  }
}); 

module.exports = { client }

const Discord = require('discord.js');

client.commands = new Collection();

//const shards = client.shard.count;

const OmenList = require("./omen.json");
const OmenListToken = OmenList.token;
var countOmen = 0;
setInterval(() => {
  countOmen++;
  console.log("OmenList Data Refresh Successfull", countOmen)
  fetch('https://list.soydaddy.space/api/bots/stats', { 
      headers: { 'Authorization': OmenListToken, 'serverCount': client.guilds.cache.size, 'shardCount': 1, 'Content-Type': 'application/json' },
      method: "POST"
    })
}, 60 * 10000);


require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js")); 
const commandFolders = fs.readdirSync("./src/commands");

//Anti Crash System
const process = require("node:process");
const mainGuild = process.env.MAINGUILDID;
const owner = process.env.OWNERID;
const justin = process.env.JUSTIN;
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;

//MONGODB Check
if (!mongodbURL) return console.log("╬ Error: Cannot find MongodbURL. File: *.env*");
mongoose.set('strictQuery', false);
try {
  mongoose.connect(mongodbURL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  process.exit(1)
}

process.on('unhandledRejection', async (reason, promise) => {
  console.log("unhandled rejection at:", promise, 'reason:', reason)
});
process.on('uncaughtException', (err) => {
      console.log("Uncaught Exception:", err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => { 
      console.log("Uncaught Exception Monitor:", err);  
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
})();
client.login(process.env.token)

// Load handlers
fs.readdirSync('./src/Event Handler').forEach((dir) => {
  fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
      require(`./Event Handler/${dir}/${handler}`)(client);
  }); 
});


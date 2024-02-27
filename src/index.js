const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require(`discord.js`);
const fs = require('fs');

const functionsExt = require("../functions")
const client = new Client({ 
  intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
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

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js")); 
const commandFolders = fs.readdirSync("./src/commands");

//Anti Crash System
const process = require("node:process");
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

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError("Unhandled Rejection", reason.stack ? reason + '\n' + reason.stack : reason, promise);
});

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError("Uncaught Exception", err.stack ? err + '\n' + err.stack : err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error("Uncaught Exception Monitor:", err, "Origin:", origin);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError("Uncaught Exception Monitor", err.stack ? err + '\n' + err.stack : err, origin);
});


(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
})();
client.login(process.env.token)

var count = 0;
// Load handlers
fs.readdirSync('./src/Event Handler').forEach((dir) => {
  fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
      require(`./Event Handler/${dir}/${handler}`)(client);
      count++
  }); 
});

console.log(`Found ` ,count, ` Event Files`)

const express = require('express');
const app = express();
const lead = require('./Schemas.js/Leveling/level');
const PORT = 3000;

app.set('view engine', 'ejs');

app.get("/:guildId/leaderboard", async (req, res) => {
  try {
      const { guildId } = req.params;
      const leaderboardData = await lead.find({ Guild: guildId }).sort({ XP: -1 }).limit(10);

      const usersWithDetails = await Promise.all(leaderboardData.map(async (user) => {
          const discordUser = await client.users.fetch(user.User); 
          return {
              avatarUrl: discordUser.displayAvatarURL(),
              username: discordUser.username,
              level: user.Level,
              xp: user.XP
          };
      }));
      
      res.render('leaderboardPage', { leaderboard: usersWithDetails });
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
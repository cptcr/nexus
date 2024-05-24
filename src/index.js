const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const process = require("node:process");
require('dotenv').config();
var botStatus = false;
const functionsExt = require("../functions");

const path = require("path");

const client = new Client({ 
  intents: [
    //Guild
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
    //Direct
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
    //Message
        GatewayIntentBits.MessageContent,
    //Automod
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,

        
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

client.setMaxListeners(99999999999)

const Discord = require('discord.js');

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js")); 
const commandFolders = fs.readdirSync("./src/commands");

//Anti Crash System

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
client.login(process.env.TOKEN)

var eCount = 0;
var getEventsStatus = false;
// Load handlers
fs.readdirSync('./src/Event Handler').forEach((dir) => {
  fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
      require(`./Event Handler/${dir}/${handler}`)(client);
      eCount++
      getEventsStatus = true
  }); 
});

client.on(Events.InteractionCreate, async (interaction) => {
  let componentType;

  try {
    if (interaction.isButton()) {
      componentType = 'Buttons';
    } else {
      if (interaction.customId.startsWith('channel')) {
        componentType = 'ChannelSelect';
      } else if (interaction.customId.startsWith('role')) {
        componentType = 'RoleSelect';
      } else if (interaction.customId.startsWith('string')) {
        componentType = 'StringSelect';
      } else if (interaction.customId.startsWith('user')) {
        componentType = 'UserSelect';
      }
    }

  } catch (error) {
    return;
  }

  if (componentType) {
    try {
      const filePath = path.join(__dirname, 'Component_Handler', componentType, `${interaction.customId}.js`);
      const componentModule = require(filePath);

      if (!componentModule || !filePath ) { return; } else { await componentModule.run(interaction); }
    } catch (error) {
      console.log(`[COMPONENT HANDLER] ERROR \n${error.stack()}`)
    }
  }
});

var cpCount = 0
var cpStatus = false;

client.on("messageCreate", async (message) => {
  const prefix = "!";

  const cmdArray = [];
  
  client.handlePrefix = async (commandFolders, path) => {
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
  
        for (const file of commandFiles) {
          cpCount++
            const command = require(`../prefix/${file}`);
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
            cpStatus = true
        }
    }
  }
})

client.on('messageCreate', async message => {
  if (message.content.startsWith('!banner')) {
      const userId = message.content.split(' ')[1]; // Assuming the command is "!banner <userID>"
      const user = await client.users.fetch(userId).catch(console.error);

      if (user) {
          // Fetch the full user object to access the banner property
          const fullUser = await user.fetch();

          if (fullUser.banner) {
              const bannerUrl = `https://cdn.discordapp.com/banners/${fullUser.id}/${fullUser.banner}.png?size=4096`;
              message.channel.send(bannerUrl);
          } else {
              message.channel.send("This user does not have a banner.");
          }
      } else {
          message.channel.send("User not found.");
      }
  }
});

client.on('ready', async (client) => {
const { mongooseStatus } = require('../load');
const { getCount } = require('./functions/handelCommands')(client);
const { textColored } = require('../lib/function');

let answer = {
    mongoose : {
        message: (mongooseStatus) ? "MongoDB not connected." : "✓ [Database] MongoDB Connected.",
        color: (mongooseStatus) ? "#ff0000" : false
    },
    bot : {
        message: (botStatus) ? "Discord Bot not connected." : `✓ [Client] Discord Bot Connected to ${client.user.username}.`,
        color: (botStatus) ? "#ff0000" : false
    },
    commands : {
        message: (botStatus) ? "0 Commands loaded." : `✓ [Client] Loaded ${getCount} Commands.`,
        color: (botStatus) ? "#ff0000" : false
    },
    pCommands : {
      message: (botStatus) ? "0 Prefix Commands loaded." : `✓ [Client] Loaded ${cpCount} Prefix Commands.`,
      color: (botStatus) ? "#ff0000" : false
    },
    events : {
        message: (botStatus) ? "0 Events loaded." : `✓ [Client] Loaded ${eCount} Events.`,
        color: (botStatus) ? "#ff0000" : false
    }
}

console.log(textColored("════════════════ ⋆Systems⋆ ════════════════", '#800080'))
console.log("⋆★⋆", textColored(answer.mongoose.message, answer.mongoose.color))
console.log("⋆★⋆", textColored(answer.bot.message, answer.bot.color))
console.log("⋆★⋆", textColored(answer.commands.message, answer.commands.color))
console.log("⋆★⋆", textColored(answer.pCommands.message, answer.pCommands.color))
console.log("⋆★⋆", textColored(answer.events.message, answer.events.color))
console.log(textColored("════════════════ ⋆Systems⋆ ════════════════", '#800080'))
})



const { Poru } = require("poru");
const { colors } = require('prompt');

const nodes = [
    {
        name: "local-node",
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
    },
];

const PoruOptions = {
    library: "discord.js",
    defaultPlatform: "scsearch",
};

client.poru = new Poru(client, nodes, PoruOptions);

module.exports = {client, botStatus}
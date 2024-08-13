const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const process = require("node:process");
require('dotenv').config();
var botStatus = false;
const functionsExt = require("../functions");
const enc = require("../encrypt").token;
const chalk = require("chalk");

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
      Partials.Message,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
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
const devCommandFolders = fs.readdirSync("./src/dev");
const installedCommandFolders = fs.readdirSync("./src/user-installed-commands").filter(file => file.endsWith(".js"));


// Anti Crash System
function logErrorToFile(error, errorType) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const errorFileName = `${errorType}-${timestamp}.log`;
  const errorFilePath = path.join(__dirname, 'Errors', errorFileName);

  // Ensure the 'Errors' directory exists, create it if it does not
  fs.mkdir(path.join(__dirname, 'Errors'), { recursive: true }, (dirErr) => {
      if (dirErr) {
          console.error(chalk.red(`Failed to create directory: \n${dirErr}`))
          return;
      }

      // Define the error message, including the stack trace if available
      const errorMessage = `${errorType}: ${error.stack ? error + '\n' + error.stack : error}`;

      // Write the error message to the newly created error log file
      fs.writeFile(errorFilePath, errorMessage, (fileErr) => {
          if (fileErr) {
              console.error(chalk.red(`Failed to write to file: \n${fileErr}`));
          }
      });
  });
}

const handleProcessError = (error, type, origin = null) => {
  console.error(`${type}:`, error);
  logErrorToFile(error, type);

  // Extended functionality if needed
  if (functionsExt && functionsExt.generateError) {
    functionsExt.generateError(type, error.stack ? `${error}\n${error.stack}` : `${error}`, origin);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  handleProcessError(reason, 'Unhandled-Rejection', promise);
});

process.on('uncaughtException', (err) => {
  handleProcessError(err, 'Uncaught-Exception');
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  handleProcessError(err, 'Uncaught-Exception-Monitor', origin);
});



(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.handleDevCommands(devCommandFolders, "./src/dev");
    client.handleInstalledCommands(installedCommandFolders, "./src/user-installed-commands")
    client.handleGuildCommands("./src/custom-commands");
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
      if (interaction.isChannelSelectMenu()) {
        componentType = 'ChannelSelect';
      } else if (interaction.isRoleSelectMenu()) {
        componentType = 'RoleSelect';
      } else if (interaction.isStringSelectMenu()) {
        componentType = 'StringSelect';
      } else if (interaction.isUserSelectMenu()) {
        componentType = 'UserSelect';
      } else if (interaction.isAnySelectMenu()) {
        componentType = "SelectMenus"
      }
    }

  } catch (error) {
    return;
  }

  if (componentType) {
    try {
      const filePath = path.join(__dirname, 'Component_Handler', componentType, `${interaction.customId}.js`);
      const componentModule = require(filePath);

      if (!componentModule || !filePath ) { return; } else { await componentModule.run(interaction, client); }
    } catch (error) {
      console.log(chalk.red(`[COMPONENT HANDLER] ERROR \n${error.stack()}`));
    }
  }
});

var cpCount = 0
var cpStatus = false;

client.on("messageCreate", async (message) => {
  const prefix = "!";

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase(); // Gets the command name and ensures it is in lowercase
  const commandPath = `./prefix/${commandName}.js`;

  try {
    // Dynamically importing the command module
    const command = await import(commandPath).catch(() => {
      throw new Error('Command not found');
    });

    // Executing the command if it exists and is a function
    if (command && typeof command.reply === 'function') {
      await command.reply(message);
    } else {
      throw new Error('Invalid command structure');
    }
  } catch (error) {
    console.error(chalk.red(error));
    message.reply(`An error occurred: ${error.message}`);
  }
});


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
const { getCount } = require('./functions/handleCommands')(client);
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
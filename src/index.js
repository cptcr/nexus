const {
  AttachmentBuilder,
  MessageType,
  Client,
  Partials,
  GatewayIntentBits,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
  Events,
  AuditLogEvent,
  MessageCollector,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const fs = require("fs");
const process = require("node:process");
require("dotenv").config();
var botStatus = false;
const functionsExt = require("../functions");
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
  partials: [Partials.Channel, Partials.Reaction, Partials.Message],
  allowedMentions: {
    parse: [`users`, `roles`],
    repliedUser: true,
  },
});

client.setMaxListeners(99999999999);

const Discord = require("discord.js");

client.commands = new Collection();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

//Anti Crash System

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError(
    "Unhandled Rejection",
    reason.stack ? reason + "\n" + reason.stack : reason,
    promise
  );
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError(
    "Uncaught Exception",
    err.stack ? err + "\n" + err.stack : err
  );
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.error("Uncaught Exception Monitor:", err, "Origin:", origin);
  // Optionally use functionsExt.generateError if it logs the details as desired
  functionsExt.generateError(
    "Uncaught Exception Monitor",
    err.stack ? err + "\n" + err.stack : err,
    origin
  );
});

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
})();
client.login(process.env.TOKEN);

var eCount = 0;
var getEventsStatus = false;
// Load handlers
fs.readdirSync("./src/Event Handler").forEach((dir) => {
  fs.readdirSync(`./src/Event Handler/${dir}`).forEach((handler) => {
    require(`./Event Handler/${dir}/${handler}`)(client);
    eCount++;
    getEventsStatus = true;
  });
});
var cpCount = 0;
var cpStatus = false;

client.on("messageCreate", async (message) => {
  const prefix = "!";

  const cmdArray = [];

  client.handlePrefix = async (commandFolders, path) => {
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        cpCount++;
        const command = require(`../prefix/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        cpStatus = true;
      }
    }
  };
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!banner")) {
    const userId = message.content.split(" ")[1]; // Assuming the command is "!banner <userID>"
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

client.on("ready", async (client) => {
  const { mongooseStatus } = require("../load");
  const { getCount } = require("./functions/handelCommands")(client);
  const { textColored } = require("../lib/function");

  let answer = {
    mongoose: {
      message: mongooseStatus
        ? "MongoDB not connected."
        : "✓ MongoDB Connected.",
      color: mongooseStatus ? "#ff0000" : false,
    },
    bot: {
      message: botStatus
        ? "Discord Bot not connected."
        : `✓ Discord Bot Connected to ${client.user.username}.`,
      color: botStatus ? "#ff0000" : false,
    },
    commands: {
      message: botStatus
        ? "0 Commands loaded."
        : `✓ Loadded ${getCount} Commands.`,
      color: botStatus ? "#ff0000" : false,
    },
    pCommands: {
      message: botStatus
        ? "0 Prefix Commands loaded."
        : `✓ Loadded ${cpCount} Prefix Commands.`,
      color: botStatus ? "#ff0000" : false,
    },
    events: {
      message: botStatus ? "0 Events loaded." : `✓ Loadded ${eCount} Events.`,
      color: botStatus ? "#ff0000" : false,
    },
  };

  console.log(
    textColored("════════════════ ⋆Systems⋆ ════════════════", "#800080")
  );
  console.log(
    "⋆★⋆",
    textColored(answer.mongoose.message, answer.mongoose.color)
  );
  console.log("⋆★⋆", textColored(answer.bot.message, answer.bot.color));
  console.log(
    "⋆★⋆",
    textColored(answer.commands.message, answer.commands.color)
  );
  console.log(
    "⋆★⋆",
    textColored(answer.pCommands.message, answer.pCommands.color)
  );
  console.log("⋆★⋆", textColored(answer.events.message, answer.events.color));
  console.log(
    textColored("════════════════ ⋆Systems⋆ ════════════════", "#800080")
  );
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!postRules")) {
    const rulesEmbed = new EmbedBuilder()
      .setTitle("Rules")
      .setDescription("Please read our rules!")
      .setColor("Blurple")
      .addFields(
        {
          name: "Rule 1 [Respect]",
          value:
            "Treat all members with respect. Harassment, hate speech, or discriminatory behavior will result in severe penalties.",
          inline: false,
        },
        {
          name: "Rule 2 [Profile Content]",
          value:
            "Keep your profile clean from offensive, inappropriate, or explicit content, including usernames, avatars, and statuses.",
          inline: false,
        },
        {
          name: "Rule 3 [Impersonation]",
          value:
            "Impersonation of members, staff, or any individual is strictly prohibited and can result in immediate bans.",
          inline: false,
        },

        // Communication
        {
          name: "Rule 4 [Spamming]",
          value:
            "Avoid spamming in any form. This includes excessive messaging, emote use, or command misuse.",
          inline: false,
        },
        {
          name: "Rule 5 [Links and Media]",
          value:
            "Do not share harmful links, unauthorized invites, or inappropriate media. This will be met with strict action.",
          inline: false,
        },
        {
          name: "Rule 6 [Sensitive Content]",
          value:
            "Sensitive discussions should be limited to designated areas and handled respectfully to avoid disputes.",
          inline: false,
        },

        // Advertising and Self-Promotion
        {
          name: "Rule 7 [Self Advertising]",
          value:
            "Unauthorized advertising or self-promotion is forbidden. This includes direct messaging members without consent.",
          inline: false,
        },

        // Server Participation
        {
          name: "Rule 8 [Joining this Server]",
          value:
            "Joining and participating in this server means you agree to follow all rules. Non-compliance may lead to penalties.",
          inline: false,
        },
        {
          name: "Rule 9 [Staff Pings]",
          value:
            "Only ping staff for valid reasons. Misuse of this feature is not tolerated and may result in disciplinary action.",
          inline: false,
        },
        {
          name: "Rule 10 [Mini-Modding]",
          value:
            "Do not act as a moderator. Report rule violations to the staff using the proper channels.",
          inline: false,
        },

        // Hosting and Server Use
        {
          name: "Rule 11 [Hosting Software]",
          value:
            "Use our hosting software responsibly. Any misuse, such as deploying malicious code, will lead to immediate suspension.",
          inline: false,
        },
        {
          name: "Rule 12 [Using Our Servers]",
          value:
            "The servers provided should be used as intended. Any form of abuse or unauthorized use will result in service revocation.",
          inline: false,
        },

        // Information Security
        {
          name: "Rule 13 [Code Sharing]",
          value:
            "Do not share dangerous or copyrighted code. Always respect intellectual property rights and ensure software safety.",
          inline: false,
        },
        {
          name: "Rule 14 [Sharing Sensitive Information]",
          value:
            "Keep personal and sensitive information secure. Do not share such information without explicit consent.",
          inline: false,
        },

        // Support and Requests
        {
          name: "Rule 15 [Support Tickets]",
          value:
            "Open support tickets only for valid issues. Non-essential tickets waste resources and may lead to restrictions.",
          inline: false,
        },
        {
          name: "Rule 16 [Tickets and Bot Requests]",
          value:
            "For bot purchases, open a BOT REQUEST TICKET. Ensure you have a legitimate need before opening any ticket.",
          inline: false,
        },

        // Compliance and Enforcement
        {
          name: "Rule 17 [Moderation Actions]",
          value:
            "Violations of these rules may result in warnings, mutes, kicks, or bans depending on the severity of the offense.",
          inline: false,
        },
        {
          name: "Rule 18 [Acceptance of Terms]",
          value:
            "By using NEXUS services and this server, you accept our [Terms of Service](https://tos.toowake.repl.co) and [Privacy Policy](https://privacy-policy.toowake.repl.co).",
          inline: false,
        }
      )
      .setImage(
        "https://us-east-1.tixte.net/uploads/toowake.bot.style/DALL%C2%B7E_2024-04-23_03.01.54_-_A_graphic_image_with_a_very_large_white_text_'RULES'_centered_on_a_black_background._The_text_shoul.webp"
      );
    await message.channel.send({ embeds: [rulesEmbed] });
  }
});

const { Poru } = require("poru");

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

module.exports = { client, botStatus };

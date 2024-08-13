const { Client, GatewayIntentBits, Partials } = require("discord.js");
const chalk = require('chalk');
require("dotenv").config();

const packageInfo = require("../package.json");

console.log(chalk.cyan("Creating temporary client..."));
const client = new Client({ 
    intents: [
        // Guild
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        // Direct
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        // Message
        GatewayIntentBits.MessageContent,
        // Automod
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

// Function to format large numbers with suffixes like "k", "M", etc.
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // 1M for 1,000,000
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'; // 1k for 1,000
    }
    return num.toString();
}

(async () => {
    console.log(chalk.cyan("Client created"));
    console.log(chalk.yellow("Logging in..."));
    await client.login(process.env.TOKEN);
    console.log(chalk.green("Login successful!"));

    // Wait until the client is fully ready
    await client.once('ready', async () => {
        // Add a small delay to ensure the WebSocket connection is fully established
        setTimeout(async () => {
            const totalChannels = client.channels.cache.size;
            
            // Calculate the total number of users
            let totalUsers = 0;
            client.guilds.cache.forEach(guild => {
                totalUsers += guild.memberCount;
            });

            const info = chalk.magentaBright(`
**Bot Username:** ${client.user.username}#${client.user.discriminator}
**Bot ID:** ${client.user.id}
**Bot Creation Date:** ${client.user.createdAt}
**WebSocket Ping:** ${client.ws.ping} ms
**Discord.js Version:** ${packageInfo.dependencies["discord.js"]} 
**Node.js Version:** ${process.version} 
**OS:** ${process.platform} 
**Bot Version:** ${packageInfo.version} 
**Total Guilds (Servers):** ${formatNumber(client.guilds.cache.size)}
**Total Channels:** ${formatNumber(totalChannels)}
**Total Users:** ${formatNumber(totalUsers)}
**Client ID (from .env):** ${process.env.ID}
            `);
            
            console.log(info);

            console.log(chalk.cyan("Destroying temporary client..."));
            await client.destroy();
            console.log(chalk.green("Temporary client destroyed!"));

            process.exit(0);
        }, 2000); 
    });
})();

const { EmbedBuilder, Events, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = async (client) => {
    // Define the list of games to monitor
    const games = ["Valorant", "Call of Duty", "League of Legends", "Fortnite", "Minecraft", "Rocket League", "Forza Horizon", "GTA V"];

    client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
        const guild = newPresence.guild;

        // Function to find or create a game specific voice channel
        async function findOrCreateChannel(guild, gameName) {
            const existingChannel = guild.channels.cache.find(channel => channel.name === gameName && channel.type === ChannelType.GuildVoice);
            if (!existingChannel) {
                return await guild.channels.create({
                    name: gameName,
                    type: ChannelType.GuildVoice,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
                            deny: [PermissionFlagsBits.Speak]
                        }
                    ]
                });
            }
            return existingChannel;
        }

        // Function to delete the channel if no one is in it
        async function deleteChannelIfEmpty(channel) {
            if (channel.members.size === 0) {
                await channel.delete();
            }
        }

        // Check each game and manage channels accordingly
        games.forEach(async (gameName) => {
            const newGame = newPresence.activities.find(activity => activity.name === gameName && activity.type === 'PLAYING');
            const oldGame = oldPresence ? oldPresence.activities.find(activity => activity.name === gameName && activity.type === 'PLAYING') : false;

            if (newGame && !oldGame) {
                // User just started playing the game
                const channel = await findOrCreateChannel(guild, gameName);
                console.log(`Channel created for ${gameName}`);
            } else if (!newGame && oldGame) {
                // User stopped playing the game, check if channel should be deleted
                const channel = guild.channels.cache.find(channel => channel.name === gameName && channel.type === ChannelType.GuildVoice);
                if (channel) {
                    await deleteChannelIfEmpty(channel);
                    console.log(`Checked channel for deletion: ${gameName}`);
                }
            }
        });
    });
}

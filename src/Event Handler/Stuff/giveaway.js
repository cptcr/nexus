const { Client, GatewayIntentBits, Events, EmbedBuilder, TextInputStyle } = require("discord.js");
const Giveaway = require("../../Schemas.js/New/giveaway");

module.exports = async (client, interaction) => {
    setInterval(async () => {
        try {
            const giveaways = await Giveaway.find();

            for (const giveaway of giveaways) {
                if (!giveaway.ended) {
                    const now = new Date();
                    const gwtime = new Date(giveaway.endTime);

                    if (now.getTime() >= gwtime.getTime()) { // comparing in milliseconds
                        const xchannel = giveaway.channelId;
                        const channel = await client.channels.fetch(xchannel).catch(error => {
                            return; // Return null if the channel is not found
                        });

                        if (!channel) {
                            continue; // Skip to the next giveaway
                        }

                        const msg = giveaway.messageId;
                        const message = await channel.messages.fetch(msg).catch(error => {
                            return; // Return null if the message is not found
                        });

                        if (!message) {
                            continue; // Skip to the next giveaway
                        }

                        // Check if the giveaway has already been ended
                        if (giveaway.ended) {
                            continue; // Skip to the next giveaway
                        }

                        const winners = selectWinners(giveaway.participants, giveaway.winnersCount);
                        //console.log("Selected winners:", winners); // Log winners for debugging
                        const winnersText = winners.map(winner => `<@${winner}>`).join(', ');
                        const announcement = `🎉 Congratulations to all winners of this giveaway! (${winnersText})!`;

                        const embed = new EmbedBuilder()
                            .setDescription(`>>> Winner(s): ${winnersText} \nPrice: ${giveaway.prize}`)
                            .setColor("Blue")
                            .setTitle("🎉 Giveaway System - End of Giveaway")
                            .setFooter({ text: `Giveaway ID: ${giveaway.id}` });

                        await message.edit({ content: `${winnersText}`,embeds: [embed], components: [] });

                        // Update the giveaway as ended
                        giveaway.ended = true;
                        await giveaway.save();
                    }
                }
            }
        } catch (error) {
            //console.error("Error in giveaway check:", error);
        }
    }, 1000)
};

function selectWinners(participants, count) {
    const shuffledParticipants = participants.sort(() => Math.random() - 0.5); // Shuffle participants array
    return shuffledParticipants.slice(0, count);
}

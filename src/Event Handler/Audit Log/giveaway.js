const { Client, GatewayIntentBits, Events, EmbedBuilder } = require("discord.js");
const Giveaway = require("../../Schemas.js/New/giveaway");

module.exports = async (client) => {

    setInterval(async () => {
        const giveaways = await Giveaway.find();
    
        for (const giveaway of giveaways) {
            if (!giveaway.ended) {
                const now = Date.now();
                if (now >= giveaway.endTime.getTime()) { 
                    try {
                        const channel = await client.channels.fetch(giveaway.channelId);
                        const message = await channel.messages.fetch(giveaway.messageId);
    
                        const winners = selectWinners(giveaway.participants, giveaway.winnersCount);
                        const winnersText = winners.map(winner => `<@${winner}>`).join(', ');
                        const announcement = `🎉 Congratulations to the winners: ${winnersText}!`;
    
                        const embed = new EmbedBuilder().setDescription(`Winner(s): ${winnersText}`).setColor("Green").setTitle("Giveaway Ended").setFooter({text: `${giveaway.id}`});
                        await message.edit({ embeds: [embed], components: [] });
    
                        await channel.send(announcement);

                        giveaway.ended = true;
                        await giveaway.save();
                    } catch (error) {
                        console.error("Error in giveaway check:", error);
                    }
                }
            }
        }

    }, 1000)
};

function selectWinners(participants, count) {
    for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
}
    return participants.slice(0, count);
}
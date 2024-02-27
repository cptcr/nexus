const { Client, Events, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Giveaway = require("../../Schemas.js/New/giveaway");
const { ButtonBuilder } = require("@discordjs/builders");

module.exports = async (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        const customId = interaction.customId;

        if (customId.startsWith("giveaway-")) {
            const giveawayId = customId.split("-").slice(2).join("-");
            const giveaway = await Giveaway.findOne({ id: giveawayId });

            if (!giveaway) {
                await interaction.reply({ content: "This giveaway no longer exists.", ephemeral: true });
                return;
            }

            if (customId.startsWith("giveaway-join")) {
                if (!giveaway.participants.includes(interaction.user.id)) {
                    giveaway.participants.push(interaction.user.id);
                    await giveaway.save();
                    await interaction.reply({ content: "You have successfully joined the giveaway!", ephemeral: true });
                } else {
                    const leaveButton = new ButtonBuilder()
                        .setCustomId(`giveaway-leave-${giveaway.id}`)
                        .setLabel("Leave Giveaway")
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder().addComponents(leaveButton);

                    await interaction.reply({ content: "You have already joined this giveaway.", ephemeral: true, components: [row] });
                }
            } else if (customId.startsWith("giveaway-leave")) {
                if (giveaway.participants.includes(interaction.user.id)) {
                    giveaway.participants = giveaway.participants.filter(participantId => participantId !== interaction.user.id);
                    await giveaway.save();
                    await interaction.reply({ content: "You have left the giveaway!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "You are not part of this giveaway.", ephemeral: true });
                }
            }

            updateGiveawayMessage(client, giveaway);
        }
    });
};

async function updateGiveawayMessage(client, giveaway) {
    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        
        // Check if the message exists
        const message = await channel.messages.fetch(giveaway.messageId)
            .catch(error => {
                console.error("Error fetching message:", error);
                return null; // Return null if the message does not exist
            });

        if (!message) {
            console.error("Message does not exist.");
            return;
        }

        const joinButton = new ButtonBuilder()
            .setCustomId(`giveaway-join-${giveaway.id}`)
            .setLabel("Join Giveaway")
            .setStyle(ButtonStyle.Primary);

        const participantsButton = new ButtonBuilder()
            .setCustomId("none")
            .setLabel(`Participants: ${giveaway.participants.length}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const row = new ActionRowBuilder().addComponents(joinButton, participantsButton);

        await message.edit({ components: [row] });
    } catch (error) {
        console.error("Error updating giveaway message:", error);
    }
}

const { Client, GatewayIntentBits, Events, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
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
                    await interaction.reply({ content: "You have already joined this giveaway.", ephemeral: true });
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

            updateGiveawayMessage(client, giveaway, interaction.user.id);
        }
    });
};

async function updateGiveawayMessage(client, giveaway, userId) {
    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        const message = await channel.messages.fetch(giveaway.messageId);

        const joinButton = new ButtonBuilder()
        .setCustomId(`giveaway-join-${giveaway.id}`)
        .setLabel("Join Giveaway")
        .setStyle(ButtonStyle.Primary);

        const amountButton = new ButtonBuilder()
        .setCustomId("none")
        .setLabel(`Participants: ${giveaway.participants.length}`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)

        const row = new ActionRowBuilder().addComponents(
            joinButton, amountButton
        );

        await message.edit({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error("Error updating giveaway message:", error);
    }
}

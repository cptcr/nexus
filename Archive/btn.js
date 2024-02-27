
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
                .setCustomId("giveaway-leave")
                .setLabel("Leave")
                .setStyle(ButtonStyle.Danger)

                const roow = new ActionRowBuilder().addComponents(leaveButton)

                await interaction.reply({ content: "You have already joined this giveaway.", ephemeral: true, components: [roow] });
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
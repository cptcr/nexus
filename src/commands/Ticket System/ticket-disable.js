const ticketSchema = require('../../Schemas.js/ticketSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const disabled = require("../../Schemas.js/Panel/Systems/ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-disable')
        .setDescription('Disables the ticket system for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        try {
            const GuildID = interaction.guild.id;

            const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

            if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
            }

            const embed2 = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> The ticket system has been disabled already!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 Ticket System`})
            .setFooter({ text: `🎫 Ticket System Disabled`})
            const data = await ticketSchema.findOne({ GuildID: GuildID});
            if (!data)
            return await interaction.reply({ embeds: [embed2], ephemeral: true });

            await ticketSchema.findOneAndDelete({ GuildID: GuildID,});

            const channel = client.channels.cache.get(data.Channel);
            if (channel) {
                await channel.messages.fetch({ limit: 1 }).then(messages => {
                    const lastMessage = messages.first();
                    if (lastMessage.author.id === client.user.id) {
                        lastMessage.delete();
                    }
                });
            }

            const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> The ticket system has been disabled!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 Ticket System`})
            .setFooter({ text: `🎫 Ticket System Disabled`})

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            return;
        }
    }
};

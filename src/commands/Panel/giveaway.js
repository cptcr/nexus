const { SlashCommandBuilder, Permissions, PermissionFlagsBits } = require('discord.js');
const Giveaway = require('../../Schemas.js/New/giveaway');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Manages giveaways.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Starts a new giveaway.')
                .addStringOption(option => option.setName('length').setDescription('Length of the giveaway in milliseconds').setRequired(true))
                .addStringOption(option => option.setName('prize').setDescription('What is the prize?').setRequired(true))
                .addIntegerOption(option => option.setName('number_of_winners').setDescription('How many winners?').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('Where should the giveaway be posted?').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('Ends a giveaway.')
                .addStringOption(option => option.setName('contest_id').setDescription('The contest ID of the giveaway to end').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Rerolls the winners of a giveaway.')
                .addStringOption(option => option.setName('contest_id').setDescription('The contest ID of the giveaway to reroll').setRequired(true))
                .addIntegerOption(option => option.setName('number_of_winners').setDescription('How many winners to reroll?')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edits a giveaway.')
                .addStringOption(option => option.setName('contest_id').setDescription('The contest ID of the giveaway to edit').setRequired(true))
                .addStringOption(option => option.setName('length').setDescription('New length of the giveaway in milliseconds'))
                .addChannelOption(option => option.setName('channel').setDescription('New channel for the giveaway'))
                .addStringOption(option => option.setName('prize').setDescription('New prize for the giveaway'))
                .addIntegerOption(option => option.setName('number_of_winners').setDescription('New number of winners')),
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        const permsEmbed = {
            color: '#FF0000',
            title: 'Insufficient Permissions!',
            description: 'You need to be an administrator to use this command.',
            footer: { text: 'Permissions Guard' },
        };

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ embeds: [permsEmbed], ephemeral: true });
        }

        switch (subcommand) {
            case 'start':
                await startGiveaway(interaction);
                break;
            case 'end':
                await endGiveaway(interaction);
                break;
            case 'reroll':
                await rerollGiveaway(interaction);
                break;
            case 'edit':
                await editGiveaway(interaction);
                break;
            default:
                interaction.reply('Invalid subcommand.');
        }
    },
};

async function startGiveaway(interaction) {
    const durationMs = parseInt(interaction.options.getString('length'));
    const prize = interaction.options.getString('prize');
    const winnersCount = interaction.options.getInteger('number_of_winners');
    const channel = interaction.options.getChannel('channel');

    const endTime = new Date(Date.now() + durationMs);
    const code = generateRandomCode(10);

    const embedCode = {
        title: "🎉 Giveaway 🎉",
        description: `Prize: ${prize}\nEnds: <t:${Math.floor(endTime.getTime() / 1000)}:R>\nWinners: ${winnersCount}`,
        color: 0x00FFFF,
        footer: { text: `ID: ${code}` },
    };

    const embed = new EmbedBuilder(embedCode)

    const sentMessage = await channel.send({ embeds: [embed] });

    await Giveaway.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
        messageId: sentMessage.id,
        endTime: endTime,
        prize: prize,
        winnersCount: winnersCount,
        participants: [],
        id: code,
        ended: false,
    });

    await interaction.reply({ content: 'Giveaway started!', ephemeral: true });
}

async function endGiveaway(interaction) {
    const contestId = interaction.options.getString('contest_id');
    const giveaway = await Giveaway.findOne({ code: contestId });
    if (!giveaway) {
        return interaction.reply({ content: 'Could not find a giveaway with that ID.', ephemeral: true });
    }

    const winners = await pickWinners(giveaway.channelId, giveaway.messageId, giveaway.winnersCount);
    let winnerMessage = '';
    if (winners.length > 0) {
        const winnerMentions = winners.map(w => `<@${w}>`).join(', ');
        winnerMessage = `Congratulations ${winnerMentions}! You won **${giveaway.prize}**!`;
    } else {
        winnerMessage = 'Could not determine a winner.';
    }

    const channel = interaction.guild.channels.cache.get(giveaway.channelId);
    if (!channel) {
        return interaction.reply({ content: 'Could not find the giveaway channel.', ephemeral: true });
    }

    const message = await channel.messages.fetch(giveaway.messageId);
    if (!message) {
        return interaction.reply({ content: 'Could not find the giveaway message.', ephemeral: true });
    }

    await message.edit({ content: winnerMessage });

    giveaway.ended = true;
    await giveaway.save();

    interaction.reply({ content: 'The giveaway has been ended!', ephemeral: true });
}

async function editGiveaway(interaction) {
    const contestId = interaction.options.getString('contest_id');
    const newLength = interaction.options.getString('length');
    const newPrize = interaction.options.getString('prize');
    const newNumberOfWinners = interaction.options.getInteger('number_of_winners');
    const newChannel = interaction.options.getChannel('channel');

    const giveaway = await Giveaway.findOne({ code: contestId });
    if (!giveaway) {
        return interaction.reply({ content: 'Could not find a giveaway with that ID.', ephemeral: true });
    }

    if (newLength) {
        const currentEndTime = new Date(giveaway.endTime);
        const additionalTime = parseInt(newLength);
        giveaway.endTime = new Date(currentEndTime.getTime() + additionalTime);
    }
    if (newPrize) giveaway.prize = newPrize;
    if (newNumberOfWinners) giveaway.winnersCount = newNumberOfWinners;
    if (newChannel) giveaway.channelId = newChannel.id;

    await giveaway.save();

    interaction.reply({ content: 'The giveaway has been updated!', ephemeral: true });
}

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

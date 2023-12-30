const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Poll = require('../../Schemas.js/pollSchema'); // Adjust the path to your Poll model

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create Polls within your discord server")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("Create a poll")
        .addStringOption(o => o.setName("title").setDescription("the title of the poll").setRequired(true))
        .addStringOption(o => o.setName("description").setDescription("The description of your poll").setRequired(true))
        .addStringOption(o => o.setName("duration").setDescription("Use 1d for 1 day, 1s for 1 second etc....").setRequired(true))
        .addStringOption(o => o.setName("option-1").setDescription("the first option").setRequired(true))
        .addStringOption(o => o.setName("option-2").setDescription("the second option").setRequired(true))
        .addStringOption(o => o.setName("option-3").setDescription("the third option").setRequired(false))
        .addStringOption(o => o.setName("option-4").setDescription("the 4th option").setRequired(false))
        .addStringOption(o => o.setName("option-5").setDescription("the 5th option").setRequired(false))
        .addStringOption(o => o.setName("option-6").setDescription("the 6th option").setRequired(false))
        .addStringOption(o => o.setName("option-7").setDescription("the 7th option").setRequired(false))
        .addStringOption(o => o.setName("option-8").setDescription("the 8th option").setRequired(false))
        .addStringOption(o => o.setName("option-9").setDescription("the 9th option").setRequired(false))
        .addStringOption(o => o.setName("option-10").setDescription("the 10th option").setRequired(false))
        .addStringOption(o => o.setName("option-11").setDescription("the 11th option").setRequired(false))
        .addStringOption(o => o.setName("option-12").setDescription("the 12th option").setRequired(false))
        .addStringOption(o => o.setName("option-13").setDescription("the 13th option").setRequired(false))
        .addStringOption(o => o.setName("option-14").setDescription("the 14th option").setRequired(false))
        .addStringOption(o => o.setName("option-15").setDescription("the 15th option").setRequired(false))
        .addAttachmentOption(o => o.setName("image").setDescription("the image you want in your embed").setRequired(false))
        .addRoleOption(o => o.setName("pingrole").setDescription("the role you want to ping").setRequired(false))
    )
    .addSubcommand(c => c
        .setName("edit")
        .setDescription("Edit a poll")
        .addStringOption(o => o.setName("id").setDescription("the id of your poll").setRequired(true))
        .addStringOption(o => o.setName("title").setDescription("the title of the poll").setRequired(true))
        .addStringOption(o => o.setName("description").setDescription("The description of your poll").setRequired(true))
        .addStringOption(o => o.setName("duration").setDescription("Use 1d for 1 day, 1s for 1 second etc....").setRequired(true))
        .addStringOption(o => o.setName("option-1").setDescription("the first option").setRequired(true))
        .addStringOption(o => o.setName("option-2").setDescription("the second option").setRequired(true))
        .addStringOption(o => o.setName("option-3").setDescription("the third option").setRequired(false))
        .addStringOption(o => o.setName("option-4").setDescription("the 4th option").setRequired(false))
        .addStringOption(o => o.setName("option-5").setDescription("the 5th option").setRequired(false))
        .addStringOption(o => o.setName("option-6").setDescription("the 6th option").setRequired(false))
        .addStringOption(o => o.setName("option-7").setDescription("the 7th option").setRequired(false))
        .addStringOption(o => o.setName("option-8").setDescription("the 8th option").setRequired(false))
        .addStringOption(o => o.setName("option-9").setDescription("the 9th option").setRequired(false))
        .addStringOption(o => o.setName("option-10").setDescription("the 10th option").setRequired(false))
        .addStringOption(o => o.setName("option-11").setDescription("the 11th option").setRequired(false))
        .addStringOption(o => o.setName("option-12").setDescription("the 12th option").setRequired(false))
        .addStringOption(o => o.setName("option-13").setDescription("the 13th option").setRequired(false))
        .addStringOption(o => o.setName("option-14").setDescription("the 14th option").setRequired(false))
        .addStringOption(o => o.setName("option-15").setDescription("the 15th option").setRequired(false))
        .addAttachmentOption(o => o.setName("image").setDescription("the image you want in your embed").setRequired(false))
        .addRoleOption(o => o.setName("pingrole").setDescription("the role you want to ping").setRequired(false))
    )
    .addSubcommand(c => c
        .setName("end")
        .setDescription("End a running poll")
        .addStringOption(o => o.setName("id").setDescription("the id of your poll").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("delete")
        .setDescription("Delete a poll")
        .addStringOption(o => o.setName("id").setDescription("the id of your poll").setRequired(true))
    ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        switch(subcommand) {
            case "create":
                await handleCreatePoll(interaction, client);
                break;
            case "edit":
                await handleEditPoll(interaction, client);
                break;
            case "end":
                await handleEndPoll(interaction, client);
                break;
            case "delete":
                await handleDeletePoll(interaction, client);
                break;
            default:
                await interaction.reply({ content: "Invalid subcommand", ephemeral: true });
        }
    }
}

async function handleCreatePoll(interaction, client) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const duration = parseDuration(interaction.options.getString("duration"));
    const image = interaction.options.getAttachment("image");
    const options = [];

    for (let i = 1; i <= 15; i++) {
        const option = interaction.options.getString(`option-${i}`);
        if (option) options.push(option);
    }

    const pollEmbed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0x00FF00); 

    if (image) {
        pollEmbed.setImage(image.url);
    }

    let components = [];
    options.forEach((option, index) => {
        const button = new ButtonBuilder()
            .setCustomId(`vote_${index}`)
            .setLabel(option)
            .setStyle(ButtonStyle.Success);

        components.push(button);
    });

    const row = new ActionRowBuilder().addComponents(components);
    const userListButton = new ButtonBuilder()
        .setCustomId('user_list')
        .setLabel('View Voters')
        .setStyle(ButtonStyle.Primary);

    const row2 = new ActionRowBuilder().addComponents(userListButton);

    const sentMessage = await interaction.channel.send({ embeds: [pollEmbed], components: [row, row2] });

    const newPoll = new Poll({
        guildID: interaction.guild.id,
        channelID: interaction.channel.id,
        messageID: sentMessage.id,
        title: title,
        description: description,
        options: options,
        duration: duration,
        image: image ? image.url : null,
        votes: []
    });

    await newPoll.save();
    await interaction.reply({ content: "Poll created successfully!", ephemeral: true });
}


function parseDuration(durationStr) {
    return 0; 
}


async function handleEditPoll(interaction, client) {
    await interaction.reply({ content: "Poll edited!", ephemeral: true });
}

async function handleEndPoll(interaction, client) {
    await interaction.reply({ content: "Poll ended!", ephemeral: true });
}

async function handleDeletePoll(interaction, client) {
    await interaction.reply({ content: "Poll deleted!", ephemeral: true });
}


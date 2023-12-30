const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const schema = require('../../Schemas.js/autoreply');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('autoreply')
    .setDescription('Autoreply System')
    .addSubcommandGroup(g => g
        .setName('setup')
        .setDescription('Setup the autoreply system')
        .addSubcommand(c => c
            .setName('add')
            .setDescription('add a autoreply')
            .addStringOption(o => o
                .setName('trigger')
                .setDescription('the trigger for the reply')
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName('reply')
                .setDescription('The reply you want to have')
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName('delete-by-reply')
            .setDescription('Delete a autoreply by using the reply')
            .addStringOption(o => o
                .setName('reply')
                .setDescription('The reply')
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName('delete-by-keyword')
            .setDescription('Delete a autoreply by using the keyword')
            .addStringOption(o => o
                .setName('keyword')
                .setDescription('The keyword')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(c => c
        .setName('find')
        .setDescription('find a autoreply')
        .addSubcommand(c => c
            .setName('reply')
            .setDescription('Find a reply by using the keyword')
            .addStringOption(o => o
                .setName('keyword')
                .setDescription('the keyword')
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName('keyword')
            .setDescription('Find a keyword by using the reply')
            .addStringOption(o => o
                .setName('reply')
                .setDescription('the reply')
                .setRequired(true)
            )
        )
        .addSubcommand(c => c
            .setName('list')
            .setDescription('List every autoreply')
        )
    ),

    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const subcommandGroup = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({
                content: "You are not allowed to execute this command!",
                ephemeral: true
            });
        }

        switch (subcommandGroup) {
            case 'setup':
                await handleSetupSubcommands(interaction, subcommand);
                break;
            case 'find':
                await handleFindSubcommands(interaction, subcommand);
                break;
            default:
                await interaction.reply({
                    content: "This is not a valid subcommand! Please try again later!",
                    ephemeral: true
                });
        }
    }
}

async function handleSetupSubcommands(interaction, subcommand) {
    const { guild, options } = interaction;
    switch (subcommand) {
        case 'add':
            const trigger = options.getString('trigger');
            const reply = options.getString('reply');
            const newAutoReply = await schema.create({
                Guild: guild.id,
                Keyword: trigger,
                Reply: reply
            });
            await interaction.reply(`Autoreply for '${trigger}' added.`);
            break;
        case 'delete-by-reply':
            const replyToDelete = options.getString('reply');
            await schema.deleteOne({ Guild: guild.id, Reply: replyToDelete });
            await interaction.reply(`Autoreply with reply '${replyToDelete}' deleted.`);
            break;
        case 'delete-by-keyword':
            const keywordToDelete = options.getString('keyword');
            await schema.deleteOne({ Guild: guild.id, Keyword: keywordToDelete });
            await interaction.reply(`Autoreply with keyword '${keywordToDelete}' deleted.`);
            break;
    }
}

async function handleFindSubcommands(interaction, subcommand) {
    switch (subcommand) {
        case 'reply':
            const keyword = options.getString('keyword');
            const replyData = await schema.findOne({ Guild: interaction.guild.id, Keyword: keyword });
            if (replyData) {
                await interaction.reply(`Reply for keyword '${keyword}': ${replyData.Reply}`);
            } else {
                await interaction.reply(`No autoreply found for keyword '${keyword}'`);
            }
            break;
        case 'keyword':
            const reply = options.getString('reply');
            const keywordData = await schema.findOne({ Guild: interaction.guild.id, Reply: reply });
            if (keywordData) {
                await interaction.reply(`Keyword for reply '${reply}': ${keywordData.Keyword}`);
            } else {
                await interaction.reply(`No autoreply found for reply '${reply}'`);
            }
            break;
        case 'list':
            await getList(interaction.guild.id, interaction);
            break;
    }
}



async function getList(guild, interaction) {
    const data = await schema.find({ Guild: guild.id });
    if (!data || data.length === 0) return false;

    let page = 0;
    const itemsPerPage = 5; 

    const generateEmbed = start => {
        const current = data.slice(start, start + itemsPerPage);

        const embed = new EmbedBuilder()
            .setColor("White")
            .setTitle('Autoreply Page ' + (start / itemsPerPage + 1));

        current.forEach(element => {
            embed.addFields({ name: `Element ${element.Keyword}`, value: `\`\`\`js\n${element}\n\`\`\`` });
        });

        return embed;
    };

    const message = await interaction.reply({
        embeds: [generateEmbed(0)],
        components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previous_btn')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next_btn')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(data.length <= itemsPerPage)
        )]
    });

    const collector = message.createMessageComponentCollector();

    collector.on('collect', i => {
        if (i.user.id === interaction.user.id) {
            i.deferReply();
            if (i.customId === 'previous_btn' && page > 0) {
                page -= itemsPerPage;
            } else if (i.customId === 'next_btn' && page + itemsPerPage < data.length) {
                page += itemsPerPage;
            }

            message.edit({
                embeds: [generateEmbed(page)],
                components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous_btn')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next_btn')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page + itemsPerPage >= data.length)
                )]
            });
        }
    });
}
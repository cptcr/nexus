const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const voiceschema = require('../../Schemas.js/Join to create/jointocreate');
const Schema = require("../../Schemas.js/Join to create/jointocreatechannels");
const disabled = require("../../Schemas.js/Panel/Systems/jointocreate");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('join-to-create')
    .setDescription('Configure your join to create voice channel.')
    .setDMPermission(false)
    .addSubcommandGroup(group => group
        .setName("settings")
        .setDescription("The settings for your join to create channel")
        .addSubcommand(command => command
            .setName("panel")
            .setDescription("Panel for your Join to Create Channel")
            .addNumberOption(option => option
                .setName("limit")
                .setDescription("Setup the limit for your voice channel")
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(50)
            )
            .addStringOption(option => option
                .setName("channel-name")
                .setDescription("the name for your voice channel")
                .setRequired(false)
            )
        )
        .addSubcommand(command => command
            .setName("lock")
            .setDescription("lock your join to create channel")
            .addNumberOption(option => option
                .setName("user")
                .setDescription("How many users are in your voice?")
                .setMinValue(1)
                .setMaxValue(99)
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName("unlock")
            .setDescription("unlock your voice channel")
        )
        .addSubcommand(command => command
            .setName("transfer")
            .setDescription("transfer your voice channel")
            .addUserOption(option => option
                .setName("user")
                .setDescription("the user you wanz give you voice channel")
                .setRequired(true)
            )
        )
    )
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your join to create voice channel.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your join to create voice channel.').setRequired(true).addChannelTypes(ChannelType.GuildVoice)).addChannelOption(option => option.setName('category').setDescription('All new channels will be created in specified category.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)).addIntegerOption(option => option.setName('voice-limit').setDescription('Set the default limit for the new voice channels.').setMinValue(2).setMaxValue(10)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your join to create voice channel system.')),
    async execute(interaction) {

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const data = await voiceschema.findOne({ Guild: interaction.guild.id });
        
        const dataUser = await Schema.findOne({ User: interaction.user.id, Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'setup':

            if (data) return await interaction.reply({ content: `You have **already** set up the **join to create** system! \n> Do **/join-to-create disable** to undo.`, ephemeral: true});
            else {

                const channel = await interaction.options.getChannel('channel');
                const category = await interaction.options.getChannel('category');
                const limit = await interaction.options.getInteger('voice-limit') || 3;

                await voiceschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Category: category.id,
                    VoiceLimit: limit
                })

                const setupembed = new EmbedBuilder()
                .setColor(theme.theme)
                .setAuthor({ name: `🔊 Join to Create system`})
                .setFooter({ text: `🔊 System Setup`})
                .setTimestamp()
                .addFields({ name: `• Join to Create was Enabled`, value: `> Your channel (${channel}) will now act as \n> your join to create channel.`})
                .addFields({ name: `• Category`, value: `> ${category}`})
                .addFields({ name: `• Voice Limit`, value: `> **${limit}**`, inline: true})

                await interaction.reply({ embeds: [setupembed] });
            }
            
            break;
            case 'disable':

            if (!data) return await interaction.reply({ content: `You **do not** have the **join to create** system **set up**, cannot delete **nothing**..`, ephemeral: true});
            else {

                const removeembed = new EmbedBuilder()
                .setColor(theme.theme)
                .setAuthor({ name: `🔊 Join to Create system`})
                .setFooter({ text: `🔊 System Disabled`})
                .setTimestamp()
                .addFields({ name: `• Join to Create was Disabled`, value: `> Your channel (<#${data.Channel}>) will no longer act as \n> your join to create channel.`})

                await voiceschema.deleteMany({ Guild: interaction.guild.id });

                await interaction.reply({ embeds: [removeembed] });
            }

            case 'transfer':
                const transfer = interaction.options.getMember("user");
                const data2 = await Schema.findOne({ User: transfer.user.id, Guild: interaction.guild.id});

        if (data2) {
            return await interaction.reply({
                content: "This user already has a voice channel, or isnt in your voice channel!",
                ephemeral: true
            })
        };

        if (dataUser) {
            await Schema.create({
                User: transfer.id,
                Channel: data.Channel,
                Guild: interaction.guild.id
            }).catch(err => {
                return interaction.reply({
                    content: "There was an Error while transfering your voice channel",
                    ephemeral: true
                })
            });
            await Schema.deleteMany({ User: interaction.user.id, Guild: interaction.guild.id}).catch(err => {
                return interaction.reply({
                    content: "There was an Error while transfering your voice channel",
                    ephemeral: true
                })
            });

            const channel = data.Channel;
            const channelx = await interaction.guild.channels.cache.get(`${channel}`);

            channelx.edit({
                name: `${transfer.user.username}'s-room`,
            })

            await interaction.reply({
                content: `\`Transfer Successfull!\` Transfer to <@${transfer.id}>!`,
                ephemeral: true
            }).catch(err => {
                return interaction.reply({
                    content: "There was an Error while transfering your voice channel",
                    ephemeral: true
                })
            });
        } else if (!dataUser) {
            return await interaction.reply({
                content: "You dont have a valid voice channel!",
                ephemeral: true
            })
        }
            break;
            case "panel":
                const {options, user, guild} = interaction;
                const limit = options.getNumber("limit");
                const name = options.getString("channel-name") || "Name not changed!";
        if (!dataUser) {
            return await interaction.reply({
                content: "You dont have a active voice channel!",
                ephemeral: true
            })
        } else if (dataUser) {
            const channel = dataUser.Channel;
            const channelx = await interaction.guild.channels.cache.get(`${channel}`);

            channelx.edit({
                name: `${name}`,
                userLimit: limit,
            })

            const Embed = new EmbedBuilder()
            .setTitle("Join 2 Create")
            .addFields(
                {name: "New Limit:", value: `${limit} Members`, inline: true},
                {name: "New Name:", value: `${name}`, inline: true},
                {name: "Channel ID:", value: `${data.Channel}`, inline: true},
                {name: "Channel Mention:", value: `<#${data.Channel}>`, inline: true}
            )
            .setColor(theme.theme)
            .setTimestamp()
            .setFooter({ text: "Join to create system"})

            return await interaction.reply({ embeds: [Embed], ephemeral: true});
                        
        }
        break;
        case 'lock':
            const users = interaction.options.getNumber("user");
    
            if (!data) {
                return await interaction.reply({ content: "This **[GUILD/SERVER]** doesnt have a join to create system!", ephemeral: true});
            } else if (!dataUser) {
                return await interaction.reply({ content: "You dont have a valid voice channel in this **[GUILD/SERVER]**!", ephemeral: true});
            } else if (dataUser) {
                const channelID = dataUser.Channel;
                const channel = await interaction.guild.channels.cache.get(`${channelID}`);
    
                await channel.edit({
                    userLimit: users,
                })
    
                await interaction.reply({
                    content: "Your voice channel has been locked!",
                    ephemeral: true
                })
            }
        break;
        case 'unlock':
            if (!data) {
                return await interaction.reply({ content: "This **[GUILD/SERVER]** doesnt have a join to create system!", ephemeral: true});
            } else if (!dataUser) {
                return await interaction.reply({ content: "You dont have a valid voice channel in this **[GUILD/SERVER]**!", ephemeral: true});
            } else if (dataUser) {
                const channelID = dataUser.Channel;
                const channel = await interaction.guild.channels.cache.get(`${channelID}`);
    
                await channel.edit({
                    userLimit: data.VoiceLimit,
                })
    
                await interaction.reply({
                    content: "Your voice channel has been unlocked!",
                    ephemeral: true
                })
            }
        break;


        }
    }
}
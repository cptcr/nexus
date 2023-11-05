const{SlashCommandBuilder,EmbedBuilder,ButtonStyle,ButtonBuilder,ActionRowBuilder,ChannelType,PermissionFlagsBits}=require("discord.js");
const Schema = require("../Schemas.js/gw-dyno");
const { GiveawaysManager } = require("discord-giveaways");

const styleJSON = {
    Green: ButtonStyle.Success,
    Red: ButtonStyle.Danger,
    Blue: ButtonStyle.Primary,
    Grey: ButtonStyle.Secondary
};

const custom = {
    button: {
        emoji: "<:nexus_accept:1135254222422683758>", //<:emojiName:emojiID>
        style: styleJSON["Green"], //Button Style [Green, Grey, Blue, Red]
        label: "Enter" //Button Label
    },
    message: {
        msgDefault: "| A giveaway started", //Default Giveaway Start message
    },
    embed: {
        duration: "Duration:", //Duration Name of Field
        hostText: "Hosted by:", //Hosted by Name of Field
        inline:  true, //Boolean [true or false]
        color: "#ffffff", //HEX Code get from https://color-hex.com
    },
    reply: {
        replyStart: "Your giveaway has been started in", //Giveaway Start Text
        replyEdit: "Editing your giveaway", //Edit giveaway text
        replyEdit2: "Your **giveaway** has been **edited** successfuly!", //Success Edited
        replyEnd: "**Ending** your giveaway..", //End Giveaway Text
        replyEndSuccess: "Your **giveaway** has ended **successfuly!**", //End giveaway success
    },
    error: {
        errImage: "Error: \`Image has to end with .png, .jpg or .jpeg!\`", //Error Image file end
        errFindUpdate: "Sorry, i cant find a giveaway with the ID", //Error cannot find id
        replyEditErr: "An **error** occured! Please contact **toowake** if this issue continues. \n> **Error**: ", //error while update
        EPHEMERALERR: true, //Boolean Ephemeral [true or false]
    },
    perms: {
        defPerms: PermissionFlagsBits.Administrator, //Default Permissions for using this command
        missingPermTxt: "Sorry, you need the Admin permission to execute this command!", //Permission Error Text
        EPHEMERALPERM: true, //Boolean Ephemeral [true or false]
    },
    command: {
        name: "gw",
        description: "Giveaway time",
        subcommands: {
            start: {
                name: "start",
                description: "Start a giveaway",
                options: {
                    channel: {
                        name: "channel",
                        description: "the channel the giveaway should be send in",
                        types: [ChannelType.GuildText, ChannelType.GuildAnnouncement]
                    },
                    title: {
                        name: "title",
                        description: "the title for the embed"
                    },
                    duration: {
                        name: "duration",
                        description: "the duration of the givaway use 1s, 1m or 1h for the time"
                    },
                    winners: {
                        name: "winners",
                        description: "the amount of winners",
                        minimum: 1
                    },
                    prizedetails: {
                        name: "prize-details",
                        description: "details for the prize"
                    },
                    dmwinners: {
                        name: "dm-winners",
                        description: "should i dm the winners?"
                    },
                    mentionRoles: {
                        name: "mentioned-roles",
                        description: "the roles mentioned in the giveaway"
                    },
                    winnerRole: {
                        name: "winner-role",
                        description: "the role the winner gets"
                    },
                    image: {
                        name: "image-url",
                        description: "the url of the embed image"
                    },
                }
            },
            edit: {
                name: "edit",
                description: "edit a giveaway",
                options: {
                    gwid: {
                        name: "giveaway-id",
                        description: "the id of the giveaway"
                    },
                    title: {
                        name: "title",
                        description: "the title of the embed"
                    },
                    duration: {
                        name: "duration",
                        description: "the duration of the givaway use 1s, 1m or 1h for the time"
                    },
                    winners: {
                        name: "winner-amount",
                        description: "the amount of winners",
                        minimum: 1
                    },
                    prizedetails: {
                        name: "prize-details",
                        description: "the details of the prize"
                    },
                    dmwinners: {
                        name: "dm-winners",
                        description: "should i dm the winners?"
                    },
                    mentionRoles: {
                        name: "mention-roles",
                        description: "the mentioned roles"
                    },
                    winnerRole: {
                        name: "winner-role",
                        description: "the role the winner gets"
                    },
                    image: {
                        name: "image",
                        description: "the url of the embed image"
                    },
                }
            },
            end: {
                name: "end",
                description: "end a giveaway",
                options: {
                    gwid: {
                        name: "giveaway-id",
                        description: "end a giveaway"
                    }
                }
            }
        }
    }
}

//check Hex Color
function isValidHexColorCode(colorCode) {
    const hexColorPattern = /^#[A-Fa-f0-9]{6}$/;
  
    return hexColorPattern.test(colorCode);
}

if (!isValidHexColorCode(custom.embed.color)) {
    return console.log(`Invalid Hex Code: Please use a color hex code from https://color-hex.com \nAt custom.embed.color`)
}

//Check Object
function checkObject(input) {
    if (input !== Object) {
        return console.error(`Error: ${input} has to be an Object!`)
    } else {
        return console.log(`Check for ${input} done!`)
    }
}

checkObject(custom.button.style);
checkObject(custom.command.subcommands.start.options.channel.types);
checkObject(custom.perms.defPerms);

//check Boolean
function checkBoolean(input) {
    if (input !== Boolean) {
        return console.error(`Error: ${input} has to be Boolean!`)
    } else {
        return console.log(`Check for ${input} done!`)
    }
}

checkBoolean(custom.error.EPHEMERALERR);
checkBoolean(custom.perms.EPHEMERALPERM);

//check number
function checkNumber(number) {
    if (number !== Number) {
        return console.error(`Error: ${number} is not a Number!`)
    } else {
        return console.log(`Check for ${number} done!`)
    }
}

checkNumber(custom.command.subcommands.start.options.winners.minimum);
checkNumber(custom.command.subcommands.edit.options.winners.minimum);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`${custom.command.name}`)
    .setDescription(`${custom.command.description}`)
    .addSubcommand(command => command
        .setName(`${custom.command.subcommands.start.name}`)
        .setDescription(`${custom.command.subcommands.start.description}`)
        .addChannelOption(option => option
            .setName(`${custom.command.subcommands.start.options.channel.name}`)
            .setDescription(`${custom.command.subcommands.start.options.channel.description}`)
            .setRequired(true)
            .addChannelTypes(custom.command.subcommands.start.options.channel.types)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.start.options.title.name}`)
            .setDescription(`${custom.command.subcommands.start.options.title.description}`)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.start.options.duration.name}`)
            .setDescription(`${custom.command.subcommands.start.options.duration.description}`)
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName(`${custom.command.subcommands.start.options.winners.name}`)
            .setDescription(`${custom.command.subcommands.start.options.winners.description}`)
            .setRequired(true)
            .setMinValue(custom.command.subcommands.start.options.winners.minimum)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.start.options.prizedetails.name}`)
            .setDescription(`${custom.command.subcommands.start.options.prizedetails.description}`)
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName(`${custom.command.subcommands.start.options.dmwinners.name}`)
            .setDescription(`${custom.command.subcommands.start.options.dmwinners.description}`)
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName(`${custom.command.subcommands.start.options.mentionRoles.name}`)
            .setDescription(`${custom.command.subcommands.start.options.mentionRoles.description}`)
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName(`${custom.command.subcommands.start.options.winnerRole.name}`)
            .setDescription(`${custom.command.subcommands.start.options.winnerRole.description}`)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.start.options.image.name}`)
            .setDescription(`${custom.command.subcommands.start.options.image.description}`)
            .setRequired(false)
        )
    )
    .addSubcommand(command => command
        .setName(`${custom.command.subcommands.edit.name}`)
        .setDescription(`${custom.command.subcommands.edit.description}`)
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.edit.options.gwid.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.gwid.description}`)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.edit.options.title.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.title.description}`)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.edit.options.duration.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.duration.description}`)
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName(`${custom.command.subcommands.edit.options.winners.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.winners.description}`)
            .setRequired(true)
            .setMinValue(custom.command.subcommands.edit.options.winners.minimum)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.edit.options.prizedetails.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.prizedetails.description}`)
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName(`${custom.command.subcommands.edit.options.dmwinners.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.dmwinners.description}`)
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName(`${custom.command.subcommands.edit.options.mentionRoles.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.mentionRoles.description}`)
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName(`${custom.command.subcommands.edit.options.winnerRole.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.winnerRole.description}`)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.edit.options.image.name}`)
            .setDescription(`${custom.command.subcommands.edit.options.image.description}`)
            .setRequired(false)
        )
    )
    .addSubcommand(command => command
        .setName(`${custom.command.subcommands.end.name}`)
        .setDescription(`${custom.command.subcommands.end.description}`)
        .addStringOption(option => option
            .setName(`${custom.command.subcommands.end.options.gwid.name}`)
            .setDescription(`${custom.command.subcommands.end.options.gwid.description}`)
            .setRequired(true)
        )
    ),

    async execute (interaction, client) {
        const {options, guild, member, user} = interaction;
        const {getString, getBoolean, getInteger, getChannel, getRole, getSubcommand} = options;
        const s = getSubcommand();

        function convertTimeToMilliseconds(timeString) {
            const lastChar = timeString.slice(-1);
            const numericValue = parseFloat(timeString);
          
            // Define conversion factors
            const secondsToMilliseconds = 1000; 
            const minutesToMilliseconds = 60 * secondsToMilliseconds; 
            const hoursToMilliseconds = 60 * minutesToMilliseconds; 
            const daysToMilliseconds = 24 * hoursToMilliseconds; 
          
            
            if (lastChar === 'd') {
              return numericValue * daysToMilliseconds;
            } else if (lastChar === 'h') {
              return numericValue * hoursToMilliseconds;
            } else if (lastChar === 'm') {
              return numericValue * minutesToMilliseconds;
            } else if (lastChar === 's') {
              return numericValue * secondsToMilliseconds;
            } else {
              throw new Error("Invalid time format. Use '1d' for days, '1h' for hours, '1m' for minutes, or '1s' for seconds.");
            }
        }

        if (!member.permissions.has(defPerms)) {
            await interaction.reply({
                content: `${missingPermTxt}`,
                ephemeral: EPHEMERALPERM
            })
        }
          
          
        
        switch (s) {
            case custom.command.subcommands.start.name:
                const start = custom.command.subcommands.start;

                const channelStart = getChannel(start.options.channel.name);
                const titleStart = getString(start.options.title.name);
                const prizeDetailsStart = getString(start.options.prizedetails.name);
                const dmWinnersStart = getBoolean(start.options.dmwinners.name);
                const mentionRoleStart = getRole(start.options.mentionRoles.name);
                const winnerRoleStart = getRole(start.options.winnerRole.name);
                const imageStart = getString(start.options.image.name);
                const durationStart = getString(start.options.duration.name);
                const winnersStart = getInteger(start.options.winners.name);

                const d = await convertTimeToMilliseconds(durationStart);

                if (d.startsWith("Invalid")) {
                    await interaction.reply({
                        content: d,
                        ephemeral: custom.error.EPHEMERALERR
                    })
                }

                const id = Date.now() + Math.floor(Math.random() * 1000);

                const button = new ButtonBuilder()
                .setLabel(custom.button.label)
                .setEmoji(custom.button.emoji)
                .setCustomId("enter-gw-dyno")
                .setDisabled(false)
                .setStyle(custom.button.style)

                const row = new ActionRowBuilder().addComponents(button)

                const embed = new EmbedBuilder()
                .setTitle(`${titleStart}`)
                .addFields({ name: `${custom.embed.duration}`, value: `<t:${d}:F>`, inline: custom.embed.inline})
                .addFields({ name: `${custom.embed.hostText}`, value: `${user}`, inline: custom.embed.inline})
                .setColor(custom.embed.color)
                .setFooter({ text: `${guild.name} | ${id} `})
                
                if (prizeDetailsStart) {
                    embed.setDescription(prizeDetailsStart)
                }

                if (imageStart) {
                    if (!imageStart.endsWith(".png") && !imageStart.endsWith(".jpg") && !imageStart.endsWith(".jpeg")) {
                        await interaction.reply({ content: `${custom.error.imageStart}`, ephemeral: custom.error.EPHEMERALERR})
                    }
                } else {
                    embed.setImage(`${imageStart}`)
                }

                var textStart;

                if (mentionRoleStart) {
                    textStart = `# ${mentionRoleStart} ${custom.message.msgDefault}`
                } else {
                    textStart = `# @everyone ${custom.message.msgDefault}`
                }

                const message = await channelStart.send({ embeds: [embed], components: [row], content: `${textStart}` })

                const dataStart = await Schema.create({
                    Channel: channelStart.id,
                    Message: message.id,
                    Guild: guild.id,
                    Duration: d,
                    Title: titleStart,
                    Details: prizeDetailsStart,
                    ID: id,
                    Winners: winnersStart,
                    Mention: mentionRoleStart,
                    WinRole: winnerRoleStart,
                    DM: dmWinnersStart,
                    Host: user.id,
                    Image: imageStart,
                    Conent: textStart,
                });

                client.giveawayManager.start(channelStart, {
                    titleStart,
                    winnersStart,
                    durationStart,
                    hostedBy: user,
                    lastChance: {
                        enabled: true,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: custom.embed.color
                    }
                });

                await interaction.reply({ content: `${custom.replyStart} ${channelStart}! \n**Data:**\n\`\`\`${dataStart}\`\`\``, ephemeral: custom.error.EPHEMERALERR})
            break;

            case custom.command.subcommands.edit.name:
                const gwIdEdit = getString(
                    custom.command.subcommands.edit.options.gwid.name
                );

                const data = await Schema.findOne({ Guild: guild.id, ID: gwIdEdit});

                if (data) {
                    await interaction.reply({
                        content: `${custom.reply.replyEdit}`,
                        ephemeral: custom.error.EPHEMERALERR
                    });

                    const channel = data.Channel;
                    const durDur = getString(custom.command.subcommands.edit.options.duration.name);
                    const Title = getString(custom.command.subcommands.edit.options.title.name) || data.Title;
                    const Details = getString(custom.command.subcommands.edit.options.prizedetails.name) || data.Details;
                    const Winners = getInteger(custom.command.subcommands.edit.options.winners.name) || data.Winners;
                    const WinRole = getRole(custom.command.subcommands.edit.options.winnerRole.name) || data.WinRole;
                    const Mention = getRole(custom.command.subcommands.edit.options.mentionRoles.name) || data.Mention;
                    const DM = getBoolean(custom.command.subcommands.edit.options.dmwinners.name) || data.DM;
                    const img = getString(custom.command.subcommands.edit.options.image.name) || data.Image;

                    let CONTENT;
                    
                    if (WinRole) {
                        CONTENT = `# ${WinRole} ${custom.message.msgDefault}`
                    } else {
                        CONTENT = `${data.Conent}`
                    }

                    let editDur;

                    if (durDur) {
                        const durNor = convertTimeToMilliseconds(durDur);
                        editDur = durNor;
                    } else {
                        editDur = data.Duration
                    }

                    await data.update({
                        Channel: channel,
                        Title: Title,
                        Details: Details,
                        WinRole: WinRole,
                        Winners: Winners,
                        Mention: Mention,
                        DM: DM,
                        Conent: CONTENT,
                        Image: img
                    })

                    const messageChannel = await client.channels.cache.get(data.Channel)
                    const message = await messageChannel.messages.fetch(data.Message);

                    const button = new ButtonBuilder()
                    .setLabel(custom.button.label)
                    .setEmoji(custom.button.emoji)
                    .setCustomId("enter-gw-dyno")
                    .setDisabled(false)
                    .setStyle(custom.button.style)
    
                    const row = new ActionRowBuilder().addComponents(button)

                    const editEmbed = new EmbedBuilder()
                    .setTitle(`${Title}`)
                    .setColor(custom.embed.color)
                    .setFooter({ text: `${guild.name} | ${data.ID} `})
                    .addFields(
                        {name: `${custom.embed.hostText}`, value: `<@${user.id}>`, inline: custom.embed.inline},
                        { name: `${custom.embed.duration}`, value: `<t:${editDur}:F>`, inline: custom.embed.inline}
                    )

                    if (Details) {
                        embed.setDescription(`${Details}`)
                    }

                    if (img) {
                        if (!img.endsWith(".png") && !img.endsWith(".jpg") && !img.endsWith(".jpeg")) {
                            await interaction.reply({ content: `${custom.error.errImage}`, ephemeral: custom.err.EPHEMERALERR})
                        }
                    } else {
                        editEmbed.setImage(`${imageStart}`)
                    }

                    await message.edit({ content: `${CONTENT}`, components: [row], embeds: [editEmbed] })

                    client.giveawayManager.edit(data.Message, {
                        setTime: -ms(editDur),
                        newWinnerCount: Winners,
                        newPrize: Title
                    }).then(() => {
                        interaction.editReply({ content: `${custom.reply.replyEdit2}`, ephemeral: custom.err.EPHEMERALERR});
                    }).catch((err) => {
                        interaction.editReply({ content: `${custom.error.replyEditErr} ${err}`, ephemeral: custom.err.EPHEMERALERR});
                    });
                } else {
                    return await interaction.reply({ content: `${custom.error.errFindUpdate} \`${gwIdEdit}\`!`})
                }
            break;

            case custom.command.subcommands.end.name:
                const idEnd = getString(custom.command.subcommands.end.options.gwid.name);

                const endData = await Schema.findOne({ Guild: guild.id, ID: idEnd});

                if (endData) {
                    await interaction.reply({ content: `${custom.reply.replyEnd}`, ephemeral: custom.err.EPHEMERALERR});
         
                    const messageId1 = getString(custom.command.subcommands.end.options.gwid.name);
                                client.giveawayManager
                    .end(messageId1)
                    .then(() => {
                        interaction.editReply({ content: `${custom.reply.replyEndSuccess}`, ephemeral: custom.err.EPHEMERALERR});
                    })
                    .catch((err) => {
                        interaction.editReply({ content: `${custom.error.replyEditErr} \n> **Error**: ${err}`, ephemeral: custom.err.EPHEMERALERR});
                    });

                } else {
                    return await interaction.reply({
                        content: `${custom.error.errFindUpdate} \`${gwIdEdit}\`!`,
                        ephemeral: custom.err.EPHEMERALERR
                    })
                }
            break;
        }
    }
}
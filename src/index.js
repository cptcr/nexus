const { AttachmentBuilder, MessageType, Client, Partials, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, MessageCollector, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require(`discord.js`);
const fs = require('fs');
const GiveawaysManager = require("../src/Utils/giveaway");
const { createTranscript } = require('discord-html-transcripts');
const QuickChart = require('quickchart-js');
const os = require("os");
const path = require('path');
const axios = require("axios");

const client = new Client({ 
  intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
      Partials.Channel, 
      Partials.Reaction, 
      Partials.Message
  ],
  allowedMentions: {
  parse: [`users`, `roles`],
  repliedUser: true,
  }
}); 

const Discord = require('discord.js');

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

let errorData = [];
//JSON Error log
try {
    const errorLog = fs.readFileSync('errorLog.json', 'utf-8');
    errorData = JSON.parse(errorLog)
} catch (error) {
}

//Anti Crash System
const process = require("node:process");
const mainGuild = process.env.MAINGUILDID;
const owner = process.env.OWNERID;
const justin = process.env.JUSTIN;

//Unhandled Rejections
process.on('unhandledRejection', async (reason, promise) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: "Unhandled Rejection",
        promise: `${promise}`,
        reason: `${reason}`,
    }

    errorData.push(logEntry)
});

//Uncaught Exception
process.on('uncaughtException', (err) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: "Uncaugt Exception",
            error: `${err}`
        }
        errorData.push(logEntry)
});

//Uncaught Exception Monitor
process.on('uncaughtExceptionMonitor', (err, origin) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: "Uncaught Exception Monitor",
        error: `${err}}`,
        origin: `${origin}`,
    }

    errorData.push(logEntry)
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

//ghost ping
const ghostSchema = require("./Schemas.js/Ghostping/ghostpingSchema");
const numSchema  = require("./Schemas.js/Ghostping/ghostnum");
 
client.on(Events.MessageDelete, async message => {
 
    const Data = await ghostSchema.findOne({ Guild: message.guild.id});
    if (!Data) return;
 
    if (!message.author) return;
    if (message.author.bot) return;
    if (!message.author.id === client.user.id) return;
    if (message.author === message.mentions.users.first()) return;
 
    if (message.mentions.users.first() || message.type === MessageType.reply) {
 
        let number;
        let time = 15;
 
        const data = await numSchema.findOne({ Guild: message.guild.id, User: message.author.id});
        if (!data) {
            await numSchema.create({
                Guild: message.guild.id,
                User: message.author.id,
                Number: 1
            })
 
            number = 1;
        } else {
            data.Number += 1;
            await data.save();
 
            number = data.Number;
        }
 
        if (number == 2) time = 60;
        if (number >= 3) time = 500;
 
        const msg = await message.channel.send({ content: `${message.author}, you cannot ghost ping members within this server!`, ephemeral: true});
        setTimeout(() => msg.delete(), 5000);
 
        const member = message.member;
 
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        } else {
            await member.timeout(timeout * 1000, "Ghost Pinging");
            await member.send({ content: `You have been timed out in ${message.guild.name} for ${time} seconds due to ghost pinging members`}).catch(err => {
                return;
            })
        }
    }
})

//anti link system
const linkSchema = require('./Schemas.js/linkSchema');
client.on(Events.MessageCreate, async message => {
 
    if (message.content.includes('http') || message.content.includes('discord.gg') || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg/') || message.content.includes('dsc.gg')) {
 
        const Data = await linkSchema.findOne({ Guild: message.guild.id}).catch(err => {
            return;
        });
 
        if (!Data) return;
 
        const memberPerms = Data.Perms;
 
        const user = message.author;
        const member = message.guild.members.cache.get(user.id);
 
        if (member.permissions.has(memberPerms)) return;
        else {
            await message.channel.send({ content: `${message.author}, you can't send links here!`}).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            })
 
            ;(await message).delete();
        }
    }
})
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (newMessage.content.includes('http') || newMessage.content.includes('discord.gg') || newMessage.content.includes('https://') || newMessage.content.includes('http://') || newMessage.content.includes('discord.gg/') || newMessage.content.includes('dsc.gg')) {
        const Data = await linkSchema.findOne({ Guild: oldMessage.guild.id}).catch(err => {
            return;
        });
 
        if (!Data) return;
 
        const memberPerms = Data.Perms;
 
        const user = oldMessage.author;
        const member = oldMessage.guild.members.cache.get(user.id);
 
        if (member.permissions.has(memberPerms)) return;
        else {
            await message.channel.send({ content: `${message.author}, you can't send links here!`}).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            })
 
            ;(await message).delete();
        }
    }
})
//giveaway system
client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#a200ff",
      embedColorEnd: "#550485",
      reaction: "🎉",
    },
})



//reminder
const remindSchema = require("./Schemas.js/remindSchema");
setInterval(async () => {

    const reminders = await remindSchema.find();
    if(!reminders) return;
    else {
        reminders.forEach(async reminder => {


            if (reminder.Time > Date.now()) return;
            
            const user = await client.users.fetch(reminder.User);

            user.send({
                content: `${user}, you asked me to remind you about: \`${reminder.Remind}\``
            }).catch(err => {
                return;
            });

            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);


// JOIN TO CREATE VOICE CHANNEL CODE //
const joinschema = require('./Schemas.js/Join to create/jointocreate');
const joinchannelschema = require('./Schemas.js/Join to create/jointocreatechannels');

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

    try {
        if (newState.member.guild === null) return;
    } catch (err) {
        return;
    }

    if (newState.member.id === '1076798263098880116') return;

    const joindata = await joinschema.findOne({ Guild: newState.member.guild.id });
    const joinchanneldata1 = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

    const voicechannel = newState.channel;

    if (!joindata) return;

    if (!voicechannel) return;
    else {

        if (voicechannel.id === joindata.Channel) {

            if (joinchanneldata1) {
                
                try {

                    const joinfail = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTimestamp()
                    .setAuthor({ name: `🔊 Join to Create System`})
                    .setFooter({ text: `🔊 Issue Faced`})
                    .setTitle('> You tried creating a \n> voice channel but..')
                    .addFields({ name: `• Error Occured`, value: `> You already have a voice channel \n> open at the moment.`})

                    return await newState.member.send({ embeds: [joinfail] });

                } catch (err) {
                    return;
                }

            } else {

                try {

                    const channel = await newState.member.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `${newState.member.user.username}-room`,
                        userLimit: joindata.VoiceLimit,
                        parent: joindata.Category
                    })
                    
                    try {
                        await newState.member.voice.setChannel(channel.id);
                    } catch (err) {
                        console.log('Error moving member to the new channel!')
                    }   

                    setTimeout(() => {

                        joinchannelschema.create({
                            Guild: newState.member.guild.id,
                            Channel: channel.id,
                            User: newState.member.id
                        })
                        
                    }, 500)
                    
                } catch (err) {

                    console.log(err)

                    try {

                        const joinfail = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setTimestamp()
                        .setAuthor({ name: `🔊 Join to Create System`})
                        .setFooter({ text: `🔊 Issue Faced`})
                        .setTitle('> You tried creating a \n> voice channel but..')
                        .addFields({ name: `• Error Occured`, value: `> I could not create your channel, \n> perhaps I am missing some permissions.`})
    
                        await newState.member.send({ embeds: [joinfail] });
    
                    } catch (err) {
                        return;
                    }

                    return;

                }

                try {

                    const joinsuccess = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTimestamp()
                    .setAuthor({ name: `🔊 Join to Create System`})
                    .setFooter({ text: `🔊 Channel Created`})
                    .setTitle('> Channel Created')
                    .addFields({ name: `• Channel Created`, value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**!`})

                    await newState.member.send({ embeds: [joinsuccess] });

                } catch (err) {
                    return;
                }
            }
        }
    }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

    try {
        if (oldState.member.guild === null) return;
    } catch (err) {
        return;
    }

    if (oldState.member.id === '1076798263098880116') return;

    const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });

    if (!leavechanneldata) return;
    else {

        const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

		if (newState.channel === voicechannel) return;

        try {
            await voicechannel.delete()
        } catch (err) {
            return;
        }

        await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id })
        try {

            const deletechannel = new EmbedBuilder()
            .setColor('DarkRed')
            .setTimestamp()
            .setAuthor({ name: `🔊 Join to Create System`})
            .setFooter({ text: `🔊 Channel Deleted`})
            .setTitle('> Channel Deleted')
            .addFields({ name: `• Channel Deleted`, value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**!`})

            await newState.member.send({ embeds: [deletechannel] });

        } catch (err) {
            return;
        } 
    }
})

// AFK System Code //

const afkSchema = require('./Schemas.js/afkschema');

client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;
     try {
    const afkcheck = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (afkcheck) {
        const nick = afkcheck.Nickname;

        await afkSchema.deleteMany({
            Guild: message.guild.id,
            User: message.author.id
        })
        
        await message.member.setNickname(`${nick}`).catch(Err => {
            return;
        })

        const m1 = await message.reply({ content: `Hey, you are **back**!`, ephemeral: true})
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {
        
        const members = message.mentions.users.first();
        if (!members) return;
        const afkData = await afkSchema.findOne({ Guild: message.guild.id, User: members.id })

        if (!afkData) return;

        const member = message.guild.members.cache.get(members.id);
        const msg = afkData.Message;

        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK, let's keep it down.. \n> **Reason**: ${msg}`, ephemeral: true});
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    } } catch (err) {
      return;
    }
})

/// TICKET SYSTEM //
const ticketSchema = require("./Schemas.js/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;


      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: "1046468420037787720",
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          }
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Ticket Opened")
          .setDescription(`Welcome to your ticket ${interaction.user.username}\n React with 🔒 to close the ticket`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })

          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('<:mod:1135253601221083166>'),
            new ButtonBuilder()
            .setCustomId("claim")
            .setLabel("Claim")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("lock")
            .setLabel("lock")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setLabel("unlock")
            .setCustomId("unlock")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Success)
          )

          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })

          const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket created in <#${channel.id}>`)

          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }

    if (customId === "claim") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setTitle("Ticket has been claimed!")
        .addFields(
            {name: "Moderator:", value: `<@${interaction.user.id}>`, inline: true}
        )
        .setColor("Green")
        .setTimestamp()

        await interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed]});

        await interaction.reply({ content: "**claimed** channel **successfull!**", ephemeral: true});
    }

    if (customId === "lock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`This channel has been **LOCKED** by <@${interaction.user.id}>!`)
        .setColor("Red")
        
        await interaction.channel.send({ embeds: [embed]})

        await interaction.reply({ content: "**locked** channel **successfull!**", ephemeral: true});
    }

    if (customId === "unlock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`This channel has been **UNLOCKED** by <@${interaction.user.id}>!`)
        .setColor("Green")
        
        await interaction.channel.send({ embeds: [embed]});

        await interaction.reply({ content: "**unlocked** channel **successfull!**", ephemeral: true});
    }

    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 are you sure you want to close this ticket?')
      .setColor('Red')

      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),

        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )

      await interaction.reply({ embeds: [closingEmbed], components: [buttons], ephemeral: true })
    }

    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Closed by`, value: `${interaction.user.tag}`}
      )
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })

      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Red')

      await interaction.reply({ embeds: [processEmbed] })

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
     }

     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Ticket close cancelled')
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})

//command logging
const logSchema = require("./Schemas.js/loggingSchema");
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction) return;
    if(!interaction.isChatInputCommand()) return;
    else {
    const channel = await client.channels.cache.get("1127250053451485246");
    const server = interaction.guild.name;
    const userId = interaction.user.id;
    const data = await logSchema.findOne({ User: interaction.user.id});

    const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle(`⚠️ Chat Command Used!`)
    .addFields({ name: `Server Name`, value: `${server}`})
    .addFields({ name: `Chat Command`, value: `${interaction.commandName}`})
    .addFields({ name: `User`, value: `<@${userId}>`})
    .addFields({ name: `Channel`, value: `${interaction.channel.id}`})
    .addFields({ name: `Link:`, value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`})
    .setTimestamp()
    .setFooter({ text: `Chat Command Executed`})
    
    if (!data) {
        await channel.send({ embeds: [embed] }).catch(err => {
            console.log("There was an error logging the command!")
        });
    } else {
        console.log("Command has been used!")
    }
    
    
    }
 })

 //blacklist server
 const blacklistserver = require('./Schemas.js/Blacklist/blacklistserver');
 client.on(Events.InteractionCreate, async guild => {
   const data = await blacklistserver.findOne({ Guild: guild.id });
 
   if(!data) {
     return;
   } else {
     await guild.leave();
   }
 })


//XP System
const levelSchema = require("./Schemas.js/Leveling/level");
const levelChannel = require("./Schemas.js/Leveling/xpChannel");
const levelDisable = require("./Schemas.js/Panel/Systems/xp");
const levelRole = require("./Schemas.js/Leveling/xp-roles");
const levelAmount = require("./Schemas.js/Leveling/xp-message")
client.on(Events.MessageCreate, async (message) => {
    if (message.guild) {
        const disData = await levelDisable.findOne({ Guild: message.guild.id });
        if (disData) return;
    }
    
    const { guild, author } = message;

    if (!guild || author.bot) return;

    levelSchema.findOne({
        Guild: guild.id,
        User: author.id
    }, async (err, data) => {

        if (err) throw err;

        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })

    let amount;
    const dataAmount = await levelAmount.findOne({
        Guild: message.guild.id,
    });

    if (dataAmount) {
        amount = dataAmount.XP
    } else {
        amount = 5
    }

    const dataChannel = await levelChannel.findOne({ Guild: message.guild.id });

    const give = amount;

    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

    if (!data) return;

    const requiredXP = data.Level * data.Level * 10 * 10;

    if (data.XP + give >= requiredXP) {
        data.XP += give;
        data.Level +=1;
        await data.save();

        const roleData = await levelRole.findOne({
            Level: data.Level,
            Guild: message.guild.id
        })

        if (roleData) {
            const targetMember = message.member;
            const role = message.guild.roles.cache.get(roleData.Role)
            if (role) {
                await targetMember.roles.add(role).catch(err => {console.log(err)});
            }
        }

        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`${author} you have reached **Level ${data.Level}**!`)
        .addFields(
            {name: "XP:", value: `${data.XP}`, inline: true},
            {name: "Level:", value: `${data.Level}`, inline: true}
        )
        .setFooter({ text: "Requested by YellowBebo"})
        .setTimestamp()
        .setThumbnail(author.displayAvatarURL())

        if (dataChannel) {
            const i = await client.channels.cache.get(`${dataChannel.Channel}`);
            await i.send({ embeds: [embed], content: `<@${message.author.id}>`, ephemeral: true });
        } else if (!dataChannel) {
            await message.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        }
    } else {
        data.XP += give;
        data.save();
    }
})

//guilds
client.on('messageCreate', async (message) => {
  const prefix = '!'
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.guild.id !== mainGuild) {
    return;
  }
  
  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase();
  
  if (command === "guilds" || command === "guildlist") {
  try {
    if (message.author.id !== owner && message.author.id !== justin) {
      return await message.reply({
        content: "You **do not** have permission to do that!",
      });
    }    

    const guilds = client.guilds.cache;
    const pageSize = 5;
    const pages = Math.ceil(guilds.size / pageSize);
    let page = 1;
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    let guildList = "";
    let index = 1;

    for (const [guildId, guild] of guilds) {
      const owner = guild.members.cache.get(guild.ownerId);

      if (!owner) continue;

      if (index > end) break;

      if (index > start) {
        guildList += `**Guild**: ${guild.name} (${guildId})\n`;
        guildList += `**Members**: ${guild.memberCount}\n`;
        guildList += `**Owner**: ${owner.user.tag} (${owner.user.id})\n`;
        let bot = guild.members.cache.get(client.user.id);
        if (bot.permissions.has(PermissionFlagsBits.CreateInstantInvite)) {
          const inviteChannel = guild.channels.cache.find(
            (c) => c.type === 0
          );
          if (inviteChannel) {
            const invite = await inviteChannel.createInvite();
            guildList += `**Invite**: ${invite.url}\n\n`;
          } else {
            guildList += "**Invite**: Invite cannot be generated\n\n";
          }
        } else {
          guildList +=
            "**Invite**: Bot does not have permission to create invites\n\n";
        }
      }

      index++;
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("<:minus:1135260042447310848>")
        .setCustomId("back")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setEmoji("<:home:1135253307984711680>")
        .setCustomId("home")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setEmoji("<:plus:1135259973547466884>")
        .setCustomId("next")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setTitle("Guilds")
      .setDescription(guildList)
      .setColor("Aqua")
      .setFooter({ text: `Page ${page}/${pages} | Guilds: ${guilds.size}` })
      .setTimestamp();

    const msg = await message.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    if (pages > 1) {
      const collector = message.channel.createMessageComponentCollector({
        time: 30000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== message.author.id) {
          return i.reply({
            content: `Only <@${message.author.id}> can use these buttons.`,
            ephemeral: true,
          });
        }

        if (i.customId === "back" && page > 1) {
          page--;
        } else if (i.customId === "back" && page === 1) {
          page = pages;
        } else if (i.customId === "next" && page < pages) {
          page++;
        } else if (i.customId === "home" && page > 1) {
          page = 1;
        } else if (i.customId === "next" && page === pages) {
          page = 1;
        }

        const newstart = (page - 1) * pageSize;
        const newend = page * pageSize;

        guildList = "";
        index = 1;

        for (const [guildId, guild] of guilds) {
          const owner = guild.members.cache.get(guild.ownerId);

          if (!owner) continue;

          if (index > newend) break;

          if (index > newstart) {
            guildList += `**Guild**: ${guild.name} (${guildId})\n`;
            guildList += `**Members**: ${guild.memberCount}\n`;
            guildList += `**Owner**: ${owner.user.tag} (${owner.user.id})\n`;
            let bot = guild.members.cache.get(client.user.id);
            if (
              bot.permissions.has(PermissionFlagsBits.CreateInstantInvite)
            ) {
              const inviteChannel = guild.channels.cache.find(
                (c) => c.type === 0
              );
              if (inviteChannel) {
                const invite = await inviteChannel.createInvite();
                guildList += `**Invite**: ${invite.url}\n\n`;
              } else {
                guildList += "**Invite**: Invite cannot be generated\n\n";
              }
            } else {
              guildList +=
                "**Invite**: Bot does not have permission to create invites\n\n";
            }
          }

          index++;
        }

        embed
          .setDescription(guildList)
          .setFooter({
            text: `Page ${page}/${pages} | Guilds: ${guilds.size}`,
          });
        await i.update({ embeds: [embed], components: [row] });

        collector.resetTimer();
      });

      collector.on("end", async () => {
        embed.setFooter({
          text: `Page ${page}/${pages} | Guilds: ${guilds.size} (Inactive)`,
        });
        await msg.edit({ embeds: [embed], components: [] });
      });
    }
  } catch (error) {
    return message.reply({
      content: "error...",
      ephemeral: true,
    });
  }
}
})

//Info Point
/*
  rules
  nexus-uptime
  nexus-stats
  Nexus 
*/

client.on(Events.InteractionCreate, async (i) => {
  const rulesEmbed = new EmbedBuilder()
  .setTitle("Rules")
  .setDescription("Please read our rules!")
  .setColor("White")
  .addFields(
    {name: "Rule 1 [Spamming]", value: "Donst Spam", inline: false},
    {name: "Rule 2 [Links and Media]", value: "Dont share phishing links, invites or anything dangerous.", inline: false},
    {name: "Rule 3 [Self Ad]", value: "Self-Advertising sucks.", inline: false},
    {name: "Rule 4 [Joining this Server]", value: "If you do anything on this server, you have accepted the rules", inline: false},
    {name: "Rule 5 [Mini-modding]", value: "No mini-modding. Ping a Staff member.", inline: false},
    {name: "Rule 6 [Staff pings]", value: "If you ping a Dev / Head Mod /Mod without a reason, you would get timeoutet, warned or banned!", inline: false},
    {name: "Rule 7 [Code share]", value: "Dont share dangerous code!", inline: false},
    {name: "Rule 8 [DM]", value: "Dont DM users. (Only DM then when the member allows it.)\n \nTo turn off your DMs for this server: \n1. Click on the Servername \n2. Click on Privacy Settings \n3. Turn off DMs", inline: false},
    {name: "Rule 9 [NEXUS]", value: "If you use NEXUS you automatically accept [TOS](https://tos.toowake.repl.co) and [Privacy Policy](https://privacy-policy.toowake.repl.co)", inline: false},
    {name: "Rule 10 [Tickets and Bot requests]", value: "Dont open a ticket without a reason. If you want to buy a discord bot, open a BOT REQUEST TICKET", inline: false},
  )
  .setImage("https://therules.org/wp-content/uploads/2017/10/LogoHorizontal.png")

  //SERVER USAGE
  const usage = process.cpuUsage();
  const usagePercent = usage.system / usage.user * 100;
  const memoryUsed = (os.totalmem - os.freemem)/1000000000;
  const memoryTotal = os.totalmem()/1000000000;

  const statsEmbed = new EmbedBuilder()
  .setTitle("Bot Stats")
  .setColor("White")
  .addFields({name: `Memory:`, value: `> ${(memoryUsed/memoryTotal * 100).toFixed(1)}%`})
  .addFields({name: 'OS:', value: `> ${os.type}`})
  .addFields({name: `OS Version:`, value: `> ${os.release}`})
  .addFields({name: 'CPU: ', value: `> ${usagePercent.toFixed(1)}%`, inline: false})
  .addFields({name: "CPU Name:", value: `> ${os.cpus()[0].model}`, inline: false})
  .addFields({name: 'CPU Type (Arch): ', value: `> ${os.arch}`, inline: false})
  .addFields({name: "Owner:", value:`> <@931870926797160538>`, inline: false})
  .addFields({name: "OS Name:", value: os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS"), inline: false})
  .addFields({name: "Platform:", value: `${os.platform}`, inline: false})

  const daysx = Math.floor(client.uptime / 86400000)
  const hoursx = Math.floor(client.uptime / 3600000) % 24
  const minutesx = Math.floor(client.uptime / 60000) % 60
  const secondsx = Math.floor(client.uptime / 1000) % 60
  const uptimeEmbed = new EmbedBuilder()
  .setTitle(`Uptime of: ${client.user.username}`)
  .setColor("White")
  .setTimestamp()
  .addFields({ name: "Days: ", value: `${daysx}`, inline: false})
  .addFields({ name: "Hours: ", value: `${hoursx}`, inline: false})
  .addFields({ name: "Minutes: ", value: `${minutesx}`, inline: false})
  .addFields({ name: "Seconds: ", value: `${secondsx}`, inline: false})

  const nexus = new EmbedBuilder()
  .setTitle(`${client.user.username}`)
  .setColor("White")
  .addFields(
    {name: "Name:", value: `${client.user.username}`},
    {name: "ID:", value:`${client.user.id}`},
    {name: "Tag:", value: `<@${client.user.id}>`},
  )

  if (i.customId === "rules") {await i.reply({embeds: [rulesEmbed], ephemeral: true})};
  if (i.customId === "Nexus") {await i.reply({embeds: [nexus], ephemeral: true})};
  if (i.customId === "nexus-stats") {await i.reply({embeds: [statsEmbed], ephemeral: true})};
  if (i.customId === "nexus-uptime") {await i.reply({embeds: [uptimeEmbed], ephemeral: true})};

})

//Blacklist User from Support DC server
client.on(Events.GuildMemberAdd, async (member) => {
  //Schema
  const SchemaB = require("./Schemas.js/Blacklist/blacklist");

  //Ban part
  if (member.guild.id !== "1121353922355929129") {
    return;
  } else {
    //get data
    const dataB = await SchemaB.findOne({ User: member.user.id });

    //if data
    if (dataB) {
      //reason
      const reasonB = dataB.Reason;
      //ban
      await member.guild.members.ban(member, {reasonB}).catch(err => {
        return;
      });
      //send msg
      await member.send({
        content: `You have been banned from our bot and support server! | Reason: ${reasonB}.`
      });
    } else {
      return;
    }
  }
});

//Autoreply
client.on(Events.MessageCreate, async (message) => {
  const autoreply = require("./Schemas.js/autoreply");

  if (message.author.bot) return;
  if (!message.author.member) return;
  
  const replyData = await autoreply.find({
    Guild: message.guild.id,
  })

  if (!replyData) return;

  for (const data of replyData) {
    const lower = data.Keyword.toLowerCase()
    if (message.content.toLowerCase().includes(lower)) {
      await message.reply(data.Reply)
    }
  }
})

// MODMAIL CODE //
const moduses = require("./Schemas.js/Modmail/modmailuses");
const modschema = require("./Schemas.js/Modmail/modmail");
client.on(Events.MessageCreate, async message => {

  if (message.guild) return;
  if (message.author.id === client.user.id) return;
  if (!message.author.user) return;
  
  const usesdata = await moduses.findOne({ User: message.author.id });

  if (!usesdata) {

      message.react('👋')

      const modselect = new EmbedBuilder()
      .setColor("White")
      .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
      .setAuthor({ name: `📞 Modmail System`})
      .setFooter({ text: `📞 Modmail Selecion`})
      .setTimestamp()
      .setTitle('> Select a Server')
      .addFields({ name: `• Select a Modmail`, value: `> Please submit the Server's ID you are \n> trying to connect to in the modal displayed when \n> pressing the button bellow!`})
      .addFields({ name: `• How do I get the server's ID?`, value: `> To get the Server's ID you will have to enable \n> Developer Mode through the Discord settings, then \n> you can get the Server's ID by right \n> clicking the Server's icon and pressing "Copy Server ID".`})

      const button = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setCustomId('selectmodmail')
          .setLabel('• Select your Server')
          .setStyle(ButtonStyle.Secondary)
      )     

      const msg = await message.reply({ embeds: [modselect], components: [button] });
      const selectcollector = msg.createMessageComponentCollector();

      selectcollector.on('collect', async i => {

          if (i.customId === 'selectmodmail') {

              const selectmodal = new ModalBuilder()
              .setTitle('• Modmail Selector')
              .setCustomId('selectmodmailmodal')

              const serverid = new TextInputBuilder()
              .setCustomId('modalserver')
              .setRequired(true)
              .setLabel('• What server do you want to connect to?')
              .setPlaceholder('Example: "1078641070180675665"')
              .setStyle(TextInputStyle.Short);

              const subject = new TextInputBuilder()
              .setCustomId('subject')
              .setRequired(true)
              .setLabel(`• What's the reason for contacting us?`)
              .setPlaceholder(`Example: "I wanted to bake some cookies, but toowake didn't let me!!!"`)
              .setStyle(TextInputStyle.Paragraph);

              const serveridrow = new ActionRowBuilder().addComponents(serverid)
              const subjectrow = new ActionRowBuilder().addComponents(subject)

              selectmodal.addComponents(serveridrow, subjectrow)

              i.showModal(selectmodal)

          }
      })

  } else {

      if (message.author.bot) return;

      const sendchannel = await client.channels.cache.get(usesdata.Channel);
      if (!sendchannel) {

          message.react('⚠')
          await message.reply('**Oops!** Your **modmail** seems **corrupted**, we have **closed** it for you.')
          return await moduses.deleteMany({ User: usesdata.User });

      } else {

          const msgembed = new EmbedBuilder()
          .setColor("#ecb6d3")
          .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
          .setFooter({ text: `📞 Modmail Message - ${message.author.id}`})
          .setTimestamp()
          .setDescription(`${message.content || `**No message provided.**`}`)

          if (message.attachments.size > 0) {

              try {
                  msgembed.setImage(`${message.attachments.first()?.url}`);
              } catch (err) {
                  return message.react('❌')
              }

          }

          const user = await sendchannel.guild.members.cache.get(usesdata.User)
          if (!user) {
              message.react('⚠️')
              message.reply(`⚠️ You have left **${sendchannel.guild.name}**, your **modmail** was **closed**!`)
              sendchannel.send(`⚠️ <@${message.author.id}> left, this **modmail** has been **closed**.`)
              return await moduses.deleteMany({ User: usesdata.User })
          }

          try {

              await sendchannel.send({ embeds: [msgembed] });

          } catch (err) {
              return message.react('❌')
          }
          
          message.react('📧')
      }
  }
})

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'selectmodmailmodal') {

      const data = await moduses.findOne({ User: interaction.user.id });
      if (data) return await interaction.reply({ content: `You have **already** opened a **modmail**! \n> Do **/modmail close** to close it.`, ephemeral: true });
      else {

          const serverid = interaction.fields.getTextInputValue('modalserver');
          const subject = interaction.fields.getTextInputValue('subject');

          const server = await client.guilds.cache.get(serverid);
          if (!server) return await interaction.reply({ content: `**Oops!** It seems like that **server** does not **exist**, or I am **not** in it!`, ephemeral: true });
          
          const executor = await server.members.cache.get(interaction.user.id);
          if (!executor) return await interaction.reply({ content: `You **must** be a member of **${server.name}** in order to **open** a **modmail** there!`, ephemeral: true});

          const modmaildata = await modschema.findOne({ Guild: server.id });
          if (!modmaildata) return await interaction.reply({ content: `Specified server has their **modmail** system **disabled**!`, ephemeral: true});
          
          const channel = await server.channels.create({
              name: `modmail-${interaction.user.id}`,
              parent: modmaildata.Category,

          }).catch(err => {
              return interaction.reply({ content: `I **couldn't** create your **modmail** in **${server.name}**!`, ephemeral: true});
          })
  
          await channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });

          const embed = new EmbedBuilder()
          .setColor("White")
          .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
          .setAuthor({ name: `📞 Modmail System`})
          .setFooter({ text: `📞 Modmail Opened`})
          .setTimestamp()
          .setTitle(`> ${interaction.user.username}'s Modmail`)
          .addFields({ name: `• Subject`, value: `> ${subject}`})

          const buttons = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setCustomId('deletemodmail')
              .setEmoji('❌')
              .setLabel('Delete')
              .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
              .setCustomId('closemodmail')
              .setEmoji('🔒')
              .setLabel('Close')
              .setStyle(ButtonStyle.Secondary)
          )
      
          await moduses.create({
              Guild: server.id,
              User: interaction.user.id,
              Channel: channel.id
          })
          
          await interaction.reply({ content: `Your **modmail** has been opened in **${server.name}**!`, ephemeral: true});
          const channelmsg = await channel.send({ embeds: [embed], components: [buttons] });
          channelmsg.createMessageComponentCollector();

      }
  }
})

client.on(Events.InteractionCreate, async interaction => {

  if (interaction.customId === 'deletemodmail') {

      const closeembed = new EmbedBuilder()
      .setColor("White")
      .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
      .setAuthor({ name: `📞 Modmail System`})
      .setFooter({ text: `📞 Modmail Closed`})
      .setTimestamp()
      .setTitle('> Your modmail was Closed')
      .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})

      const delchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
      const userdata = await moduses.findOne({ Channel: delchannel.id });

      await delchannel.send('❌ **Deleting** this **modmail**..')

      setTimeout(async () => {

          if (userdata) {

              const executor = await interaction.guild.members.cache.get(userdata.User)
              if (executor) {
                  await executor.send({ embeds: [closeembed] });
                  await moduses.deleteMany({ User: userdata.User });
              }

          }

          try {
              await delchannel.delete();
          } catch (err) {
              return;
          }
          
      }, 100)

  }

  if (interaction.customId === 'closemodmail') {

      const closeembed = new EmbedBuilder()
      .setColor("White")
      .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
      .setAuthor({ name: `📞 Modmail System`})
      .setFooter({ text: `📞 Modmail Closed`})
      .setTimestamp()
      .setTitle('> Your modmail was Closed')
      .addFields({ name: `• Server`, value: `> ${interaction.guild.name}`})

      const clchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
      const userdata = await moduses.findOne({ Channel: clchannel.id });

      if (!userdata) return await interaction.reply({ content: `🔒 You have **already** closed this **modmail**.`, ephemeral: true})

      await interaction.reply('🔒 **Closing** this **modmail**..')

      setTimeout(async () => {
          
          const executor = await interaction.guild.members.cache.get(userdata.User)
          if (executor) {

              try {
                  await executor.send({ embeds: [closeembed] });
              } catch (err) {
                  return;
              }
              
          }

          interaction.editReply(`🔒 **Closed!** <@${userdata.User}> can **no longer** view this **modmail**, but you can!`)

          await moduses.deleteMany({ User: userdata.User });

      }, 100)

  }
})

client.on(Events.MessageCreate, async message => {

  if (message.author.bot) return;
  if (!message.guild) return;

  const data = await modschema.findOne({ Guild: message.guild.id });
  if (!data) return;

  const sendchanneldata = await moduses.findOne({ Channel: message.channel.id });
  if (!sendchanneldata) return;

  const sendchannel = await message.guild.channels.cache.get(sendchanneldata.Channel);
  const member = await message.guild.members.cache.get(sendchanneldata.User);
  if (!member) return await message.reply(`⚠ <@${sendchanneldata.User} is **not** in your **server**!`)

  const msgembed = new EmbedBuilder()
  .setColor("White")
  .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
  .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
  .setFooter({ text: `📞 Modmail Received - ${message.author.id}`})
  .setTimestamp()
  .setDescription(`${message.content || `**No message provided.**`}`)

  if (message.attachments.size > 0) {

      try {
          msgembed.setImage(`${message.attachments.first()?.url}`);
      } catch (err) {
          return message.react('❌')
      }

  }

  try {
      await member.send({ embeds: [msgembed] });
  } catch (err) {
      message.reply(`⚠ I **couldn't** message **<@${sendchanneldata.User}>**!`)
      return message.react('❌')
  }
          
  message.react('📧')

})

//AUDIT LOG
const Audit_Log = require("./Schemas.js/auditlog");
const internal = require('stream');
//Add ban
client.on('guildBanAdd', async (guild, user) => {
    const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD', limit: 1 });
    const banLog = auditLogs.entries.first();
    const executor = banLog.executor;
    const reason = banLog.reason || 'No reason given';
    const timestamp = banLog.createdAt;
    const data = await Audit_Log.findOne({
        Guild: guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed
    .setTitle('Ban added')
    .addFields(
        {name: "Banned Member:", value: `Name: ${user.tag}\nID: ${user.id}`, inline: false},
        {name: "Executor:", value: `${executor.tag}\nID: ${executor.id}`, inline: false},
        {name: "Time:", value: timestamp, inline: false},
        {name: "Reason:", value: reason, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {return;});
});
//Remove ban
client.on('guildBanRemove', async (guild, user) => {
    const auditLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE', limit: 1 });
    const unbanLog = auditLogs.entries.first();
    const executor = unbanLog.executor;
    const timestamp = unbanLog.createdAt;
    const data = await Audit_Log.findOne({
        Guild: guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed
    .setTitle('Ban removed')
    .setDescription(`Name: ${user.tag}\nID: ${user.id}`)
    .addFields(
        {name: "Banned Member:", value: `${user.tag}\nID: ${user.id}`, inline: false},
        {name: "Executor:", value: `${executor.tag}\nID: ${executor.id}`, inline: false},
        {name: "Time:", value: `${timestamp}`}
    )
    await auditChannel.send({ embeds: [auditEmbed] }).catch((err) => {return;});
});
//Channel Create
client.on(Events.ChannelCreate, async (channel) => {
    const data = await Audit_Log.findOne({
        Guild: channel.guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Channel Created").addFields(
        {name: "Channel Name:", value: channel.name, inline: false},
        {name: "Channel ID:", value: channel.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Channel Delete
client.on(Events.ChannelDelete, async (channel) => {
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const data = await Audit_Log.findOne({
        Guild: channel.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Channel Deleted").addFields(
        {name: "Channel Name:", value: channel.name, inline: false},
        {name: "Channel ID:", value: channel.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Channel Update
client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const data = await Audit_Log.findOne({
        Guild: oldChannel.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
    const changes = [];
    if (oldChannel.name !== newChannel.name) {
        changes.push(`Name: \`${oldChannel.name}\` → \`${newChannel.name}\``);
      }
      if (oldChannel.topic !== newChannel.topic) {
        changes.push(`Topic: \`${oldChannel.topic || 'None'}\` → \`${newChannel.topic || 'None'}\``);
      }
      if (changes.length === 0) return; 
      const changesText = changes.join('\n');
    auditEmbed.setTitle("Channel Updated").addFields({ name: "Changes:", value: changesText})
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Role Create
client.on(Events.GuildRoleCreate, async (role) => {
    const data = await Audit_Log.findOne({
        Guild: role.guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Role Created").addFields(
        {name: "Role Name:", value: role.name, inline: false},
        {name: "Role ID:", value: role.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Role Delete
client.on(Events.GuildRoleDelete, async (role) => {
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const data = await Audit_Log.findOne({
        Guild: role.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Role Removed").addFields(
        {name: "Role Name:", value: role.name, inline: false},
        {name: "Role ID:", value: role.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Message Delete
client.on(Events.MessageDelete, async (message) => {
    const data = await Audit_Log.findOne({
        Guild: message.guild.id,
    }).catch((err) => {return;});
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    try {
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Message Deleted").addFields(
        {name: "Author:", value: `<@${message.user.id}>`, inline: false},
        {name: "Message:", value: `${message.content}`, inline: false},
        {name: "Message ID:", value: `${message.id}`}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
    } catch (err) {
        return;
    }
})
//Automod Rule Create
client.on(Events.AutoModerationRuleCreate, async (autoModerationRule) => {
    const data = await Audit_Log.findOne({
        Guild: autoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Automod Rule Created").addFields(
        {name: "Rulecreator:", value: `<@${autoModerationRule.creatorId}>`, inline: false},
        {name: "Rulename:", value: autoModerationRule.name},
        {name: "Actions:", value: `${autoModerationRule.actions}`, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Automod Rule Delete
client.on(Events.AutoModerationRuleDelete, async (autoModerationRule) => {
    const data = await Audit_Log.findOne({
        Guild: autoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Automod Rule Created").addFields(
        {name: "Rulecreator:", value: `<@${autoModerationRule.creatorId}>`, inline: false},
        {name: "Rulename:", value: autoModerationRule.name},
        {name: "Actions:", value: `${autoModerationRule.actions}`, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Automod Rule Update
client.on(Events.AutoModerationRuleUpdate, async (newAutoModerationRule, oldAutoModerationRule) => {
    const data = await Audit_Log.findOne({
        Guild: newAutoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    auditEmbed.setTitle("Automod Rule Updated").addFields(
        {name: "Old Rulename:", value: `${oldAutoModerationRule.name}`, inline: false},
        {name: "Old Actions:", value: `${oldAutoModerationRule.actions}`, inline: false},
        {name: "New Rulename:", value: newAutoModerationRule.name, inline: false},
        {name: "New Actions:", value: newAutoModerationRule.actions}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Thread create
client.on(Events.ThreadCreate, async (thread) => {
  const data = await Audit_Log.findOne({
      Guild: thread.guild.id,
  })
  let logID;
  if (data) {
      logID = data.Channel
  } else {
      return;
  }
  const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
  const auditChannel = client.channels.cache.get(logID);
  auditEmbed.setTitle("Thread Created").addFields(
      {name: "Name:", value: thread.name, inline: false},
      {name: "Tag:", value: `<#${thread.id}>`, inline: false},
      {name: "ID:", value: thread.id, inline: false},
  )
  await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Thread Delete
client.on(Events.ThreadDelete, async (thread) => {
  const data = await Audit_Log.findOne({
      Guild: thread.guild.id,
  })
  let logID;
  if (data) {
      logID = data.Channel
  } else {
      return;
  }
  const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
  const auditChannel = client.channels.cache.get(logID);

  auditEmbed.setTitle("Thread Deleted").addFields(
      {name: "Name:", value: thread.name, inline: false},
      {name: "Tag:", value: `<#${thread.id}>`, inline: false},
      {name: "ID:", value: thread.id, inline: false},
  )
  await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Invite Create
client.on(Events.InviteCreate, async (invite) => {
  
  const data = await Audit_Log.findOne({
      Guild: invite.guild.id,
  })
  let logID;
  if (data) {
      logID = data.Channel
  } else {
      return;
  }
  const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
  const auditChannel = client.channels.cache.get(logID);

  auditEmbed.setTitle("Invite Created").addFields(
      {name: "User:", value: `<@${invite.inviterId}>`, inline: false},
      {name: "Invite Code:", value: `${invite.code}`, inline: false},
      {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
      {name: "Created at:", value: `${invite.createdAt}`, inline: false},
      {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
      {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
      {name: "URL", value: `${invite.url}`}
  )
  await auditChannel.send({ embeds: [auditEmbed]}).catch(err => {
    return;
  });
})
//Invite Delete
client.on(Events.InviteDelete, async (invite) => {
  
  const data = await Audit_Log.findOne({
      Guild: invite.guild.id 
  })
  let logID;
  if (data) {
      logID = data.Channel
  } else {
      return;
  }
  const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
  const auditChannel = client.channels.cache.get(logID);

  auditEmbed.setTitle("Invite Deleted").addFields(
      {name: "User:", value: `<@${invite.user.id}>`, inline: false},
      {name: "Invite Code:", value: `${invite.code}`, inline: false},
      {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
      {name: "Created at:", value: `${invite.createdAt}`, inline: false},
      {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
      {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
      {name: "URL", value: `${invite.url}`}
  )
  await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})
//Bulk Delete
client.on(Events.MessageBulkDelete, async (messages) => {
    const firstMessage = messages.first();
    const channel = firstMessage.channel;
    const guildId = channel.guild.id;
    const data = await Audit_Log.findOne({
      Guild: guildId
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
  
    const htmlContent = generateHtmlTranscript(messages, channel, guildId);
  
    const transcriptFilePath = path.join(__dirname, 'transcripts', `transcript_${Date.now()}.html`);
    fs.writeFileSync(transcriptFilePath, htmlContent);
  
    function generateHtmlTranscript(messages, channel, guildId) {
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Bulk Delete</title>
            </head>
            <body>
                <h1>Transscript - Deleted Messages</h1>
                <p>Channel: ${channel.name} (ID: ${channel.id})</p>
                <p>Server ID: ${guildId}</p>
                <p>Amount of deleted messages: ${messages.size}</p>
                <ul>
        `;
    
        messages.forEach(message => {
            const content = message.content || '[Picture/File]';
            html += `<li><strong>${message.author.tag}</strong>: ${content}</li>`;
        });
    
        html += `
                </ul>
            </body>
            </html>
        `;
    
        return html;
    }
  
    auditEmbed.setTitle("Message Bulk Delete").addFields(
        {name: "Messages Deleted:", value: `${messages.size}`, inline: false},
        {name: "Channel:", value: `${messages.channel}`, inline: false},
    )
    await auditChannel.send({ 
      embeds: [auditEmbed],
      files: [transcriptFilePath],}).catch((err) => {return;});
  })
/*const { id, channel_id, guild_id, author, timestamp, type } = data;*/
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;
    const data = await Audit_Log.findOne({
      Guild: oldMessage.guild.id
    })
    let logID;
    if (data) {
      logID = data.Channel
    } else {
      return;
    }
    const auditEmbed = new EmbedBuilder().setColor("White").setTimestamp().setFooter({ text: "Nexus Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
    const id = oldMessage.id;
    const guildID = oldMessage.guild.id;
    const channelID = oldMessage.channel.id;
    const buttons = new ButtonBuilder()
    .setLabel("Jump to")
    .setStyle(ButtonStyle.Link)
    .setURL(`https://canary.discord.com/channels/${guildID}/${channelID}/${id}`);
    const row = new ActionRowBuilder().addComponents(buttons);
    const newText = newMessage.content;
    const oldText = oldMessage.content;
    const length1 = newMessage.length;
    const length2 = oldMessage.length;
    if (length1 >= 1024 && length2 >= 1024) {
      const LongAuditEmbed = new EmbedBuilder()
      .setTitle("Message Edited")
      .addFields({ name: 'Author:', value: `${newMessage.author.tag}`, inline: false})
      .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      const embedOld = new EmbedBuilder()
      .setTitle("Old Message")
      .setDescription(`${oldText}`)
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      const embedNew = new EmbedBuilder()
      .setTitle("New Message")
      .setDescription(`${newText}`)
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: "Nexus Audit Log System"})
      await auditChannel.send({ embeds: [LongAuditEmbed, embedOld, embedNew], components: [row]});
    }
    auditEmbed.setTitle("Message Edited")
    .addFields({ name: 'Author:', value: `${newMessage.author.tag}`, inline: false})
    .addFields({ name: 'Channel:', value: `${newMessage.channel}`, inline: false})
    .addFields({ name: 'Old Message:', value: `${oldMessage.content}`, inline: false})
    .addFields({ name: 'New Message:', value: `${newMessage.content}`, inline: false})
    await auditChannel.send({ embeds: [auditEmbed], components: [row]}).catch((err) => {return;});
})

//reactionrole
const reactSchema = require("./Schemas.js/reactionrole");
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId === "reactionrole") {
        const guild = interaction.guild.id;
        const message = interaction.message.id;
        const reactchannel = interaction.channel.id;

        const reactData = await reactSchema.findOne({
            Guild: guild,
            Message: message,
            Channel: reactchannel
        })

        if (!reactData) {
            return;
        } else if (reactData) {
            //Role ID
            const ROLE_ID = reactData.Role;
            //try add/remove role
            try {
                const targetMember = interaction.member;
                const role = interaction.guild.roles.cache.get(ROLE_ID);
                if (!role) {
                  interaction.reply({
                    content: 'Role not found.',
                    ephemeral: true
                  });
                }
                if (targetMember.roles.cache.has(ROLE_ID)) {
                    targetMember.roles.remove(role).catch(err => {return;});
                  interaction.reply({
                    content: `Removed the role ${role} from ${targetMember}.`,
                    ephemeral: true
                  });
                } else {
                  await targetMember.roles.add(role).catch(err => {return;});
                  interaction.reply({
                    content: `Added the role ${role} to ${targetMember}.`,
                    ephemeral: true
                  });
                }
              } catch (error) {
                return;
            }
        }
    }
});


/*const youtubeModel = require("./Schemas.js/Video Notif.js/youtube");
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    const seconds = 60;
    const minutes = 15;
    const millis = 1000;
    const checkInterval = minutes * seconds * millis; // 15 minutes
    setInterval(checkForVideos, checkInterval);
  });
  async function checkForVideos() {
    const allUsers = await youtubeModel.find();
    for (const userData of allUsers) {
      const { Account, Channel, Guild, Message } = userData;
      const guild = client.guilds.cache.get(Guild);
      const member = guild.members.cache.get(Account);
  
      if (member) {
        console.log(`Checking ${member.user.tag} for video publication...`);
        const videoPublished = Math.random() < 0.5; 
        if (videoPublished) {
          console.log(`${member.user.tag} published a video in the configured channel and guild.`);

          const channel = guild.channels.cache.get(Channel);

          const message = `${Message} \n`

          await channel.send({
            content: ""
          })
        }
      }
    }
  } */
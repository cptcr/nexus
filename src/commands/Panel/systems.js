const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, } = require("discord.js");
const afk = require("../../Schemas.js/Panel/Systems/afk");
const automod = require("../../Schemas.js/Panel/Systems/automod");
const economy = require("../../Schemas.js/Panel/Systems/economy");
const giveaway = require("../../Schemas.js/Panel/Systems/giveaway");
const interactions = require("../../Schemas.js/Panel/Systems/interactions");
const j2c = require("../../Schemas.js/Panel/Systems/jointocreate");
const poll = require("../../Schemas.js/Panel/Systems/remind");
const remind = require("../../Schemas.js/Panel/Systems/remind");
const stream = require("../../Schemas.js/Panel/Systems/stream");
const ticket = require("../../Schemas.js/Panel/Systems/ticket");
const warn = require("../../Schemas.js/Panel/Systems/warn");
const verify = require("../../Schemas.js/Panel/Systems/verify");
const xp = require("../../Schemas.js/Panel/Systems/xp");
const akaneko = require("../../Schemas.js/Panel/NSFW/akaneko");
const nsfw = require("../../Schemas.js/Panel/NSFW/nsfw");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("panel-systems")
    .setDescription("Enable or disable systems")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute (interaction) {
        try {
        const {guild} = interaction;
        //NOTE: WHEN DATA COMMAND = DISABLED!
        //Panel Data
        const afkData = await afk.findOne({Guild: guild.id});
        const autoData = await automod.findOne({Guild: guild.id});
        const akaData = await akaneko.findOne({ Guild: guild.id});
        const nsfwData = await nsfw.findOne({ Guild: guild.id});
        const ecoData = await economy.findOne({Guild: guild.id});
        const giveData = await giveaway.findOne({Guild: guild.id});
        const intData = await interactions.findOne({Guild: guild.id});
        const joinData = await j2c.findOne({Guild: guild.id});
        const pollData = await poll.findOne({Guild: guild.id});
        const remindData = await remind.findOne({Guild: guild.id});
        const streamData = await stream.findOne({Guild: guild.id});
        const ticketData = await ticket.findOne({Guild: guild.id});
        const warnData = await warn.findOne({Guild: guild.id});
        const verifyData = await verify.findOne({Guild: guild.id});
        const xpData = await xp.findOne({Guild: guild.id});
        //Panel Embed
        const embed = new EmbedBuilder()
        .setTitle("System Panel")
        .setDescription("Enable / Disable Systems using the buttons. Green = enabled, Red = disabled")
        .setColor("Blue")
        //buttons
        //AFK
        const afkButton = new ButtonBuilder()
        .setCustomId("afk")
        .setLabel("AFK")
        .setEmoji("<:afk:1135255403714850928>")
        .setStyle(ButtonStyle.Secondary)
        if (afkData) {
            afkButton.setStyle(ButtonStyle.Danger)
        } else {
            afkButton.setStyle(ButtonStyle.Success)
        }
        //Automod
        const autoButton = new ButtonBuilder()
        .setCustomId("automod")
        .setEmoji("<:mod:1135253601221083166>")
        .setLabel("Automod")
        .setStyle(ButtonStyle.Secondary)
        if (autoData) {
            autoButton.setStyle(ButtonStyle.Danger)
        } else {
            autoButton.setStyle(ButtonStyle.Success)
        }
        //Economy
        const ecoButton = new ButtonBuilder()
        .setCustomId("eco")
        .setLabel("Economy")
        .setEmoji("<:charity:1135253940875837470>")
        .setStyle(ButtonStyle.Secondary)
        if (ecoData) {
            ecoButton.setStyle(ButtonStyle.Danger)
        } else {
            ecoButton.setStyle(ButtonStyle.Success)
        }
        //Giveaway
        const giveButton = new ButtonBuilder()
        .setCustomId("give")
        .setLabel("Giveaway")
        .setEmoji("<:present:1135252824901554196>")
        .setStyle(ButtonStyle.Secondary)
        if (giveData) {
            giveButton.setStyle(ButtonStyle.Danger)
        } else {
            giveButton.setStyle(ButtonStyle.Success)
        }
        //Interactions
        const intButton = new ButtonBuilder()
        .setCustomId("int")
        .setLabel("Interactions")
        .setEmoji("<:community:1135254364164997282>")
        .setStyle(ButtonStyle.Secondary)
        if (intData) {
            intButton.setStyle(ButtonStyle.Danger)
        } else {
            intButton.setStyle(ButtonStyle.Success)
        }
        //Join 2 Create
        const joinButton = new ButtonBuilder()
        .setCustomId("join")
        .setLabel("Join to create")
        .setEmoji("<:web:1135253226413903955>")
        .setStyle(ButtonStyle.Secondary)
        if (joinData) {
            joinButton.setStyle(ButtonStyle.Danger)
        } else {
            joinButton.setStyle(ButtonStyle.Success)
        }
        //Poll
        const pollButton = new ButtonBuilder()
        .setCustomId("poll")
        .setEmoji("<:text:1135253509839781948>")
        .setLabel("Poll")
        .setStyle(ButtonStyle.Secondary)
        if (pollData) {
            pollButton.setStyle(ButtonStyle.Danger)
        } else {
            pollButton.setStyle(ButtonStyle.Success)
        }
        //Remind
        const remindButton = new ButtonBuilder()
        .setCustomId("remind")
        .setLabel("Remind")
        .setEmoji("<:date:1135254537507180585>")
        .setStyle(ButtonStyle.Secondary)
        if (remindData) {
            remindButton.setStyle(ButtonStyle.Danger)
        } else {
            remindButton.setStyle(ButtonStyle.Success)
        }
        //Stream
        const streamButton = new ButtonBuilder()
        .setCustomId("stream")
        .setLabel("Streaming")
        .setEmoji("<:link:1135254038749909034>")
        .setStyle(ButtonStyle.Secondary)
        if (streamData) {
            streamButton.setStyle(ButtonStyle.Danger)
        } else {
            streamButton.setStyle(ButtonStyle.Success)
        }
        //Ticket
        const ticketButton = new ButtonBuilder()
        .setCustomId("tickettt")
        .setLabel("Ticket System")
        .setEmoji("<:ticket:1135254113219784734>")
        .setStyle(ButtonStyle.Secondary)
        if (ticketData) {
            ticketButton.setStyle(ButtonStyle.Danger)
        } else {
            ticketButton.setStyle(ButtonStyle.Success)
        }
        //Warn
        const warnButton = new ButtonBuilder()
        .setCustomId("warn")
        .setLabel("Warning")
        .setEmoji("<:important:1135252858204336168>")
        .setStyle(ButtonStyle.Secondary)
        if (warnData) {
            warnButton.setStyle(ButtonStyle.Danger)
        } else {
            warnButton.setStyle(ButtonStyle.Success)
        }
        //Verify
        const verifyButton = new ButtonBuilder()
        .setCustomId("verifica")
        .setEmoji("<:accept:1135254222422683758>")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Secondary)
        if (verifyData) {
            verifyButton.setStyle(ButtonStyle.Danger)
        } else {
            verifyButton.setStyle(ButtonStyle.Success)
        }
        //XP
        const xpButton = new ButtonBuilder()
        .setCustomId("xp")
        .setLabel("Leveling")
        .setEmoji("<:shape:1135254897294577774>")
        .setStyle(ButtonStyle.Secondary)
        if (xpData) {
            xpButton.setStyle(ButtonStyle.Danger)
        } else {
            xpButton.setStyle(ButtonStyle.Success)
        }
        //Akaneko
        const akaButton = new ButtonBuilder()
        .setCustomId("aka")
        .setLabel("Akaneko")
        .setEmoji("<:star:1135253656992747550>")
        .setStyle(ButtonStyle.Secondary)
        if (akaData) {
            akaButton.setStyle(ButtonStyle.Danger)
        } else {
            akaButton.setStyle(ButtonStyle.Success)
        }
        //NSFW
        const nsfwButton = new ButtonBuilder()
        .setCustomId("nsfw")
        .setLabel("NSFW")
        .setEmoji("<:star:1135253656992747550>")
        .setStyle(ButtonStyle.Secondary)
        if (nsfwData) {
            nsfwButton.setStyle(ButtonStyle.Danger)
        } else {
            nsfwButton.setStyle(ButtonStyle.Success)
        }

        const ActionRow1 = new ActionRowBuilder()
        .addComponents(
            afkButton,
            autoButton,
            ecoButton,
            giveButton,
            intButton,
        )
        const ActionRow2 = new ActionRowBuilder()
        .addComponents(
            joinButton,
            pollButton,
            remindButton,
            streamButton,
            ticketButton,
        )  
        const ActionRow3 = new ActionRowBuilder()
        .addComponents(
            warnButton,
            verifyButton,
            xpButton,
            nsfwButton,
            akaButton,
        )
        const message = await interaction.reply({ embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
        const collector = await message.createMessageComponentCollector();
        //NOTE: WHEN DATA COMMAND = DISABLED!
        collector.on('collect', async (i, error) => {
            //Permission Check
            var {guild, member} = i;
            if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) await i.reply({content: "You are not an admin!", ephemeral: true});
            //Enable / Disable Cmds
            if (i.customId === "afk") {
                if (afkData) {
                    await afk.deleteMany({ Guild: guild.id});
                    await afkButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await afk.create({Guild: guild.id});
                    await afkButton.setStyle(ButtonStyle.Danger)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "automod") {
                if (autoData) {
                    await automod.deleteMany({Guild: guild.id});
                    await autoButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await automod.create({Guild: guild.id});
                    await autoButton.setStyle(ButtonStyle.Danger)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "eco") {
                if (ecoData) {
                    await economy.deleteMany({Guild: guild.id});
                    await ecoButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await economy.create({Guild: guild.id});
                    await ecoButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            } 
            if (i.customId === "give") {
                //const giveData = await giveaway.findOne({Guild: guild.id});
                if (giveData) {
                    await giveaway.deleteMany({Guild: guild.id});
                    await giveButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await giveaway.create({Guild: guild.id});
                    await giveButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "int") {
                //const intData = await interactions.findOne({Guild: guild.id});
                if (intData) {
                    await interactions.deleteMany({Guild: guild.id});
                    await intButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await interactions.create({Guild: guild.id});
                    await intButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "join") {
                //const joinData = await j2c.findOne({Guild: guild.id});
                if (joinData) {
                    await j2c.deleteMany({Guild: guild.id});
                    await joinButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await j2c.create({Guild: guild.id});
                    await joinButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "poll") {
                //const pollData = await poll.findOne({Guild: guild.id});
                if (pollData) {
                    await poll.deleteMany({Guild: guild.id});
                    await pollButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await poll.create({Guild: guild.id});
                    await pollButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "remind") {
                //const remindData = await remind.findOne({Guild: guild.id});
                if (remindData) {
                    await remind.deleteMany({Guild: guild.id});
                    await remindButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await remind.create({Guild: guild.id});
                    await remindButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "stream") {
                //const streamData = await stream.findOne({Guild: guild.id});
                if (streamData) {
                    await stream.deleteMany({Guild: guild.id});
                    await streamButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await stream.create({Guild: guild.id});
                    await streamButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "tickettt") {
                //const ticketData = await ticket.findOne({Guild: guild.id});
                if (ticketData) {
                    await ticket.deleteMany({Guild: guild.id});
                    await ticketButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await ticket.create({Guild: guild.id});
                    await ticketButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "warn") {
                if (warnData) {
                    await warn.deleteMany({Guild: guild.id});
                    await warnButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await warn.create({Guild: guild.id});
                    await warnButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "verifica") {
                if (verifyData) {
                    await verify.deleteMany({Guild: guild.id});
                    await verifyButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await verify.create({Guild: guild.id});
                    await verifyButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "xp") {
                //const xpData = await xp.findOne({Guild: guild.id});
                if (xpData) {
                    await xp.deleteMany({Guild: guild.id});
                    await xpButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await xp.create({Guild: guild.id});
                    await xpButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "aka") {
                if (akaData) {
                    await akaneko.deleteMany({Guild: guild.id});
                    await akaButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await akaneko.create({Guild: guild.id});
                    await akaButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (i.customId === "nsfw") {
                if (nsfwData) {
                    await nsfw.deleteMany({Guild: guild.id});
                    await nsfwButton.setStyle(ButtonStyle.Success)
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                } else {
                    await nsfw.create({Guild: guild.id});
                    await nsfwButton.setStyle(ButtonStyle.Danger);
                    await i.update({embeds: [embed], components: [ActionRow1, ActionRow2, ActionRow3]});
                }
            }
            if (error) {
                return;
            }
            if (i) {
                console.log("Panel ID:",i.customId)
            }
        }) } catch (error) { return; }
    }
}
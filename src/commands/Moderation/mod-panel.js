const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("mod-panel")
    .setDescription("Moderate a user with this panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("target")
        .setDescription("the target of the actions")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("the reason for your action")
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const {guild, options} = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason") || "No Reason given";

        //badges//
        const badges = {
            BugHunterLevel1: '<:bughunter1:1110179125643194449> ',
            BugHunterLevel2: '<:bughunter2:1110179225316634634>',
            Partner: '<:discordpartner:1110179362688471100>',
            PremiumEarlySupporter: '<:earlynitro:1110179543018377226>',
            Staff: '<:discordstaff:1110179895671259196>',
            VerifiedDeveloper: '<:developer:1110180079285325824>',
            ActiveDeveloper: '<:activedev:1110180029016580237>',
        };

        //some user staff
        const member = await interaction.guild.members.fetch(target.id);
        const userBadges = target.flags.toArray().map(badge => badges[badge]).join(' ') || 'None';
        const nick = member.displayName || 'None';
        const botStatus = target.bot ? 'Yes' : 'No';

        if (target === interaction.user) {
            return await interaction.reply({
                content: "You cant moderate yourself!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("TO 5 Minutes")
            .setEmoji("<:important:1135252858204336168>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("TO 10 Minutes")
            .setEmoji("<:important:1135252858204336168>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("TO 1 Hour")
            .setEmoji("<:important:1135252858204336168>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("TO 1 Day")
            .setEmoji("<:important:1135252858204336168>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("TO 1 Week")
            .setEmoji("<:important:1135252858204336168>")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("test0")
            .setLabel(`Moderation Panel for ${target.user.username}`)
            .setEmoji("<:mod:1135253601221083166>")
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setLabel("Delete Panel")
            .setCustomId("delete-panel")
            .setEmoji("<:reject:1135254276646641674>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("<:mod:1135253601221083166>")
            .setLabel("Untimeout")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Moderation Panel")
        .setDescription(`This is the panel to moderate <@${target.id}>!`)
        .addFields(
            {name: "Name:", value: `${target.username}`, inline: true},
            {name: "User ID:", value: `${target.id}`, inline: true},
            {name: "User:", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL:", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Reason:", value: `${reason}`, inline: false}
        ).addFields({
            name: '<:name:1110181463623729243> Nickname:',
            value: nick,
            inline: false,
        })
        .addFields({
            name: '<:booster:1110178979345870999> Boosted Server',
            value: member.premiumSince ? 'Yes' : 'No',
            inline: false,
        })
        .addFields({ 
            name: '<:bot:1110181814934450227> BOT',
            value: botStatus,
            inline: false,
        })
        .addFields({ 
            name: '<:badges:1110182071311278111> Badges',
            value: userBadges,
            inline: false,
        })
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow]
        });

        const collector = msg.createMessageComponentCollector();

        const embed2 = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Moderator: ${interaction.user.username}`})
        .setColor(theme.theme)

        collector.on('collect', async i => {

            if (i.user.id != interaction.user.id) {
                return await interaction.reply({
                    content: "This is not your panel!",
                    ephemeral: true
                })
            }

            if (i.customId === "delete-panel") {
                await msg.delete();

                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You cant delete the panel!", ephemeral: true})

                await i.reply({
                    content: "Panel Deleted!",
                    ephemeral: true
                })
            }
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "You cant **BAN** Members!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed2.setTitle("Ban").setDescription(`You have been banned in ${i.guild.name}! || **Reason:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> has been banned!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true})

                await target.timeout(null);

                embed2.setTitle("Untimeout").setDescription(`You have been untimeouted in ${i.guild.name}! || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> has been untimeouted!`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "You dont have the permission to **KICK** Members!", ephemeral: true});

                await interaction.guild.members.ban(target, {reason});

                embed2.setTitle("Kick").setDescription(`You have been kicked in ${i.guild.name}! || **Reason:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been kicked!`, ephemeral: true});
                
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **5 Minutes** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                
                await i.reply({ content: `<@${target.id}> has been timeouted for **5 Minutes**`, ephemeral: true});

            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **10 Minutes** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **10 Minutes**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for *1 Hour** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Hour**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **1 Day** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Day**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "You dont have the permission to **TIMEOUT** Members!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "There was an Error timeouting this member!", ephemeral: true });
                });

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **1 Week** || **Reason:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> has been timeouted for **1 Week**`, ephemeral: true});
            }

            
        })
    }
}
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("user-scraper")
        .setDescription("Scrape all info about a user")
        .addUserOption(option => option.setName("target").setDescription("The person you want to scrape all info").setRequired(true)),
    
        async execute(interaction) {

            const targetUser = interaction.options.getUser("target");
            const member = await interaction.guild.members.fetch(targetUser.id).catch(console.error);
            if (!member) {
                await interaction.reply({ content: "Couldn't fetch member details. They might not be a part of this guild.", ephemeral: true });
                return;
            }

            const userDataResponse = await fetch('https://api.omenlist.xyz/discord/user', { method: 'POST', headers: { apikey: process.env.OLAPIKEY, user: targetUser.id }});
            const userData = await userDataResponse.json();

            const userInfoFields = [
                { name: "Username", value: `${member.user.tag}`, inline: true },
                { name: "User ID", value: `${member.id}`, inline: true },
                { name: "Discord Join Date", value: `${member.user.createdAt.toUTCString()}`, inline: false },
                { name: "Avatar URL:", value: `${member.user.displayAvatarURL()}`, inline: false},
                { name: "Banner URL:", value: `${userData.banner || 'No has banner'}`}
            ];

            async function checkBanner() {
                var arrg;

                if (member.user.banner()) {

                    userInfoFields.push(
                        {
                            name: "Banner URL:",
                            value: `https://cdn.discordapp.com/banners/${member.id}/${member.user.banner()}.png?size=4096`,
                            inline: false
                        }
                    )

                    
                } else {

                    userInfoFields.push(
                        {
                            name: "Banner URL:",
                            value: `Not found`,
                            inline: false
                        }
                    )
                }
            }

            const memberInfoFields = [
                { name: "Guild Join Date", value: `${member.joinedAt.toUTCString()}`, inline: true },
                { name: "Nickname", value: `${member.nickname || "None"}`, inline: true },
                { name: "Boosting Since", value: `${member.premiumSince ? member.premiumSince.toUTCString() : "Not Boosting"}`, inline: false },
            ];
            
            var rolesUser = false

            const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => role.toString());
            if (roles.length > 0) {
                rolesUser = true
            }

            const memberEmbed = new EmbedBuilder()
                .setTitle(`Guild Details for ${member.user.username}`)
                .addFields(memberInfoFields)
                .setColor("#00FF00");

            const userEmbed = new EmbedBuilder()
                .setTitle(`Details for ${member.user.username}`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(userInfoFields)
                .setImage(userData?.banner)
                .setColor(userData?.accent_color || "#0099FF");

            const button = new ButtonBuilder()
                .setLabel("View Guild Data")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_raw");
            
            const button2 = new ButtonBuilder()
                .setLabel("View User JSON")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_user_json");
                
            const button3 = new ButtonBuilder()
                .setLabel("View User Roles")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_user_roles");
    
            const button4 = new ButtonBuilder()
                .setLabel("View User Permissions")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("view_user_perms");
            var row = null
            if (rolesUser) {
                row = new ActionRowBuilder().addComponents(button3, button4, button, button2);
            } else {
                row = new ActionRowBuilder().addComponents(button4, button, button2);
            }
    
            await interaction.reply({ embeds: [userEmbed, memberEmbed], components: [row] });
    
            const collector = interaction.channel.createMessageComponentCollector();
            const permissions = new PermissionsBitField(member.permissions).toArray().join(", ");
            collector.on('collect', async i => {
                let memberInfoThings = [];
                if (i.customId === "view_raw") {
                    const rawUserData = JSON.stringify(member, null, 4).substring(0, 4000); 
                    await i.reply({ content: `\`\`\`json\n${rawUserData}\n\`\`\``, ephemeral: true });
                } else if (i.customId === "view_user_json") {
                    const jsonUserData = JSON.stringify(userData, null, 4).substring(0, 4000);
                    await i.reply({ content: `\`\`\`json\n${jsonUserData}\n\`\`\``, ephemeral: true })
                } else if (i.customId === 'view_user_perms') {
                    memberInfoThings.push({ name: "Permissions", value: permissions, inline: false });
                    const embed = new EmbedBuilder()
                        .setTitle(`Guild Details for ${member.user.username}`)
                        .addFields(memberInfoThings)
                        .setColor("#00FF00");
                    await i.reply({ embeds: [embed], ephemeral: true })
                } else if (i.customId === 'view_user_roles') {
                    const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => role.toString());
                    if (roles.length > 0) {
                        memberInfoThings.push({ name: "Roles", value: roles.join(", "), inline: false });
                    }
                    const embed = new EmbedBuilder()
                        .setTitle(`Guild Details for ${member.user.username}`)
                        .addFields(memberInfoThings)
                        .setColor("#00FF00");
                    await i.reply({ embeds: [embed], ephemeral: true })
                }
            });
        }
   
};

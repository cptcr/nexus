const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Key = process.env.KEY;
const Key2 = process.env.OLTOKEN;
const BotID = "1046468420037787720";
const theme = require("../../../embedConfig.json") || "#ffffff";

module.exports = {
    data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote")
    .setDMPermission(true)
    .addSubcommand(command => command.setName("top-gg").setDescription("Vote at top.gg"))
    .addSubcommand(command => command.setName("omenlist").setDescription("Vote at omenlist")),

    async execute(interaction, client) {
        const { user } = interaction;
        const ROLE_ID = "1136733674583376022";
        const targetMember = interaction.member;

        switch (interaction.options.getSubcommand()) {
            case "top-gg":
                const response = await fetch(`https://top.gg/api/bots/${BotID}/check?userId=${user.id}`, {
                    headers: {
                        'Authorization': Key
                    }
                });
        
                const data = await response.json();
        
                const voteEmbed = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("You voted for us!")
                .setDescription(`Thank you for voting for ${client.user.username}!`)
                .setFooter({ text: "Nexus Votes"});
        
                const voteEmbed2 = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("You have already voted for us!")
                .setDescription(`Thanks that you want to vote, but you have already voted for ${client.user.username} :(`)
                .setFooter({ text: "Nexus Votes"});
        
                const embed = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("Vote for us!")
                .setDescription(`Click [here](https://top.gg/bot/${BotID}/vote) to vote!`)
                .setFooter({ text: "Nexus Votes"});
        
                if (data.voted) {
                    const targetMember = interaction.member;
                    const role = interaction.guild.roles.cache.get(ROLE_ID);
                    if (!targetMember.roles.cache.has(ROLE_ID)) {
                      await targetMember.roles.add(role).catch(err => {console.log(err)});
                    }
        
                    return await interaction.reply({
                        embeds: [voteEmbed2],
                    })
                } else {
                    const reply = await interaction.reply({
                        embeds: [embed]
                    });
        
                    const interval = setInterval(async () => {
                        const response = await fetch(`https://top.gg/api/bots/${BotID}/check?userId=${user.id}`, {
                            headers: {
                                'Authorization': "Key"
                            }
                        });
                        const newData = await response.json();
        
                        if (newData.voted) {
                            clearInterval(interval);
                            await reply.edit({
                                embeds: [voteEmbed]
                            });
                            if (!targetMember.roles.cache.has(ROLE_ID)) {
                                await targetMember.roles.add(role).catch(err => {console.log(err)});
                            }
                        }
                    }, 5000);
                }
            break;

            case "omenlist": 
                const resp = await fetch(`https://list.soydaddy.space/api/bots/check/${user.id}`, {
                    headers: {
                        "Authorization": Key2
                    }
                });

                const votedOmen = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("You voted for us!")
                .setDescription(`Thank you for voting for ${client.user.username}!`)
                .setFooter({ text: "Nexus Votes"});

                const votedOmen2 = new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("You have already voted for us!")
                .setDescription(`Thanks that you want to vote, but you have already voted for ${client.user.username} :(`)
                .setFooter({ text: "Nexus Votes"});

                const embedOmen= new EmbedBuilder()
                .setColor(theme.theme)
                .setTitle("Vote for us!")
                .setDescription(`Click [here](https://list.soydaddy.space/bot/${BotID}) to vote!`) 
                .setFooter({ text: "Nexus Votes"});

                const dataOmen = await resp.json();

                if (dataOmen.voted === true) {
                    const role = interaction.guild.roles.cache.get(ROLE_ID);
                    if (!targetMember.roles.cache.has(ROLE_ID)) {
                      await targetMember.roles.add(role).catch(err => {console.log(err)});
                    }
        
                    return await interaction.reply({
                        embeds: [votedOmen2],
                    })
                } else {
                    const reply = await interaction.reply({embeds: [embedOmen] });
        
                    const interval = setInterval(async () => {
                        const response = await fetch(`https://list.soydaddy.space/api/bots/check/${user.id}`, {
                            headers: {
                                'Authorization': Key2
                            }
                        });
                        const newData = await response.json();
        
                        if (newData.voted === true) {
                            clearInterval(interval);
                            await reply.edit({
                                embeds: [votedOmen]
                            });
                            if (!targetMember.roles.cache.has(ROLE_ID)) {
                                await targetMember.roles.add(role).catch(err => {console.log(err)});
                            }
                        }
                    }, 5000);
                }
            break;
        }
    }
};

const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const Key = process.env.KEY;
const BotID = "1046468420037787720";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote on top.gg")
        .setDMPermission(true),

    async execute(interaction, client) {
        const { user } = interaction;
        const response = await fetch(`https://top.gg/api/bots/${BotID}/check?userId=${user.id}`, {
            headers: {
                'Authorization': Key
            }
        });
        const ROLE_ID = "1136733674583376022";

        const data = await response.json();

        const voteEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("You voted for us!")
        .setDescription(`Thank you for voting for ${client.user.username}!`)
        .setFooter({ text: "Nexus Votes"});

        const embed = new EmbedBuilder()
        .setColor("White")
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
                embeds: [voteEmbed],
            })
        } else {
            const reply = await interaction.reply({
                embeds: [embed]
            });

            const interval = setInterval(async () => {
                const response = await fetch(`https://top.gg/api/bots/${BotID}/check?userId=${user.id}`, {
                    headers: {
                        'Authorization': Key
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
    }
};

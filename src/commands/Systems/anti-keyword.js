const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const disabled = require("../../Schemas.js/Panel/Systems/automod");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-word")
    .setDescription("delete messages with a specific keyowrd")
    .addStringOption(option => option
        .setName("word")
        .setDescription("The word")
        .setRequired(true)),

    async execute (interaction) {
        const { guild, options } = interaction;

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Red")
        .setDescription("Missing Permissions: Administrator")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({
            embeds: [errEmbed],
            ephemeral: true
        });

        await interaction.reply({ content: `Loading your Automod rule....`});
            const word = options.getString("word");

            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent the word ${word} by Aura Bot`,
                creatorId: '1046468420037787720',
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        keywordFilter: [`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'This message was prevented by Aura Bot'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return;
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created. Messages with **${word}** will be deleted`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed2]
                })
            }, 3000)
    }
}
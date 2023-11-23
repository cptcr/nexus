const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const disabled = require("../../Schemas.js/Panel/Systems/automod");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-flagged-words")
    .setDescription("Anti flagged words system"),

    async execute (interaction) {
        const { guild } = interaction;

        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor(theme.theme)
        .setDescription("Missing Permissions: Administrator")
        .setTimestamp()

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({
            embeds: [errEmbed],
            ephemeral: true
        });

        await interaction.reply({ content: `Loading your Automod rule....`});

            const rule = await guild.autoModerationRules.create({
                name: `Block profinity, sexual content, and slurs by Aura Bot`,
                creatorId: '1046468420037787720',
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata: 
                    {
                        presets: [1, 2, 3]
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
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor(theme.theme)
                .setDescription(`Your automod rule has been created`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed]
                })
            }, 3000)
    }
}
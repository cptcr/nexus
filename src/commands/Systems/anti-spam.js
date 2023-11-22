const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const disabled = require("../../Schemas.js/Panel/Systems/automod");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-spam")
    .setDescription("Anti Spam System")
    .addIntegerOption(option => option
        .setName("value")
        .setDescription("The number of the max Spam")
        .setRequired(true)
    ),

    async execute (interaction) {
        const { guild, options } = interaction;

        const Number = options.getInteger("value");

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor(theme.theme)
        .setDescription("Missing Permissions: Administrator")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({
            embeds: [errEmbed],
            ephemeral: true
        });

        await interaction.reply({ content: `Loading your Automod rule....`});
            

            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent Spam Messages by Aura Bot`,
                creatorId: '1046468420037787720',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: 
                    {
                        mentionTotalLimit: Number
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
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor(theme.theme)
                .setDescription(`Your automod rule has been created`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed3]
                })
            }, 3000)
    }
}
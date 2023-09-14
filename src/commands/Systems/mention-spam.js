const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const disabled = require("../../Schemas.js/Panel/Systems/automod");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-mention-spam")
    .setDescription("Anti mention spam")
    .addIntegerOption(option => option
        .setName("number")
        .setDescription("The maximum of mentions in a message")
        .setRequired(true)
    ),

    async execute (interaction) {
        const { guild, options } = interaction;

        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Red")
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
            const number =  options.getInteger("number")

            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent Spam Messages by Aura Bot`,
                creatorId: '1046468420037787720',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata: 
                    {
                        mentionTotalLimit: number
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
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Your automod rule has been created`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed4]
                })
            }, 3000)
    }
}
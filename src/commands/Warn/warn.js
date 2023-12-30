const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Schemas.js/warnSchema");
const disabled = require("../../Schemas.js/Panel/Systems/warn");
const theme = require("../../../embedConfig.json");
const {generateRandomCode} = require("../../../functions")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('This warns a server member')
    .addUserOption(option => option.setName("user").setDescription("The user you want to warn").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("This is the reason for warning the user").setRequired(false)),
    async execute(interaction) {

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: `You don't have permission to warn people!`, ephemeral: true });

        const { options, guildId, user } = interaction;


        const target = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";

        const userTag = `${target.username}#${target.discriminator}`

        const code = generateRandomCode(10)

        warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {

            if (err) throw err;

            if (!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: target.id,
                    UserTag: userTag,
                    Content: [
                        {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            warnID: code,
                        }
                    ],
                });

            } else {
                const warnContent = {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason,
                    warnID: code,
                }
                data.Content.push(warnContent);
            }
            data.save()
        });

        const embed = new EmbedBuilder()
        .setColor(theme.theme)
        .setDescription(`:white_check_mark: You have been warned in ${interaction.guild.name} | ${reason}`)
        .setFooter({ text: "Command made by toowake"})

        const embed2 = new EmbedBuilder()
        .setColor(theme.theme)
        .setDescription(`:white_check_mark: ${target.tag} has been **warned** | ${reason}`)
        .setFooter({ text: "Command made by toowake"})

        target.send({ embeds: [embed] }).catch(err => {
            return;
        })

        interaction.reply({ embeds: [embed2] });
    }
}
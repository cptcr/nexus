const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const login = require("../../Schemas.js/loginSchemaMail");
const join = require("../../Schemas.js/Join to create/jointocreatechannels");
const hug = require("../../Schemas.js/Interaction Schemas/hug");
const kiss = require("../../Schemas.js/Interaction Schemas/kiss");
const slap = require("../../Schemas.js/Interaction Schemas/slap");
const eco = require("../../Schemas.js/ecoSchema");
const level = require("../../Schemas.js/Leveling/level");
const remind = require("../../Schemas.js/remindSchema");
const test = require("../../Schemas.js/test");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete-my-data")
    .setDescription("This command deletes all your restored data!"),

    async execute (interaction, client) {
        const { user } = interaction;

        const embed = new EmbedBuilder()
        .setTitle("Delete My Data System")
        .setDescription("Are you sure to delete all your data?")
        .setColor(theme.theme)
        .setTimestamp()

        const embed2 = new EmbedBuilder()
        .setTitle("Delete My Data System")
        .setDescription("Data deleted!")
        .setFooter({ text: "Warning: This Action cant be undone!" })
        .setColor(theme.theme)
        .setTimestamp()

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel("Yes")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⚠️")
            .setCustomId("yes")
        )

        const msg = await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
        const collector = msg.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const {user} = i;
            if (i.customId === "yes") {
                await login.deleteMany({ User: user.id});
                await join.deleteMany({ User: user.id});
                await hug.deleteMany({ User: user.id});
                await kiss.deleteMany({ User: user.id});
                await slap.deleteMany({ User: user.id});
                await eco.deleteMany({ User: user.id});
                await level.deleteMany({ User: user.id});
                await remind.deleteMany({ User: user.id});
                await test.deleteMany({ UserID: user.id});

                await i.update({ embeds: [embed2], components: [], ephemeral: true });

                console.log(`${user.username} deleted all his data!`)
            }
        })

    }
}
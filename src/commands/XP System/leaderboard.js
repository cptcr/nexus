const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const levelSchema = require("../../Schemas.js/Leveling/level");
const disabled = require("../../Schemas.js/Panel/Systems/xp");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Get the XP Leaderboard of this Server"),
    async execute (interaction) {
        let text = "";
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
        const embed1 = new EmbedBuilder()
        .setColor(theme.theme)
        .setDescription("There is no user on the leaderbaord!")
        .setTimestamp()

        const Data = await levelSchema.find({ Guild: interaction.guild.id })
         .sort({
            XP: -1,
            Level: -1
         })
         .limit(10)

         if (!Data) return await interaction.reply({ embeds: [embed1]});


         await interaction.deferReply();

         for (let counter = 0; counter <= Data.length; ++counter) {
            let { User, XP, Level} = Data[counter];

            const value = await interaction.client.users.fetch(User) || "Unknown Member";

            const member = value.tag;

            text  += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`

            const embed = new EmbedBuilder()
            .setColor(theme.theme)
            .setTitle("Leaderboard")
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()

            interaction.editReply({ embeds: [embed]})
         }
    }
}
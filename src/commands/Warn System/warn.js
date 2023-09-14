const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Schemas.js/warnSchema");
const disabled = require("../../Schemas.js/Panel/Systems/warn");

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

        //Nums
        const Numbers0 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const Numbers2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const Numbers3 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const Numbers4 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        //Letters
        const Letters0 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];
        const Letters2 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];
        const Letters3 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];
        const Letters4 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];
        const Letters5 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];
        const Letters6 = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "0", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Ä", "ä", "Ö", "ö", "Ü", "ü"];

        //Code Generate

        //Number Nums
        const n1 = Math.floor(Math.random() * Numbers0.length);
        const n2 = Math.floor(Math.random() * Numbers2.length);
        const n3 = Math.floor(Math.random() * Numbers3.length);
        const n4 = Math.floor(Math.random() * Numbers4.length);
        
        //Letter Nums
        const l1 = Math.floor(Math.random() * Letters0.length);
        const l2 = Math.floor(Math.random() * Letters2.length);
        const l3 = Math.floor(Math.random() * Letters3.length);
        const l4 = Math.floor(Math.random() * Letters4.length);
        const l5 = Math.floor(Math.random() * Letters5.length);
        const l6 = Math.floor(Math.random() * Letters6.length);

        //Result Number
        const No1 = Numbers0[n1];
        const No2 = Numbers2[n2];
        const No3 = Numbers3[n3];
        const No4 = Numbers4[n4];

        //Result Letter
        const Le1 = Letters0[l1];
        const Le2 = Letters2[l2];
        const Le3 = Letters3[l3];
        const Le4 = Letters4[l4];
        const Le5 = Letters5[l5];
        const Le6 = Letters6[l6];

        //A1BCD23E4FG
        const code = `${Le1}${No1}${Le2}${Le3}${Le4}${No2}${No3}${Le5}${No4}${Le6}`;


        const target = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";

        const userTag = `${target.username}#${target.discriminator}`

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
        .setColor("Blue")
        .setDescription(`:white_check_mark: You have been warned in ${interaction.guild.name} | ${reason}`)
        .setFooter({ text: "Command made by toowake"})

        const embed2 = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: ${target.tag} has been **warned** | ${reason}`)
        .setFooter({ text: "Command made by toowake"})

        target.send({ embeds: [embed] }).catch(err => {
            return;
        })

        interaction.reply({ embeds: [embed2] });
    }
}
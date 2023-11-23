const { ButtonBuilder } = require("@discordjs/builders");
const {SlashCommandBuilder, EmbedBuilder, Embed, ActionRowBuilder, ButtonStyle } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("features")
    .setDescription("bot features")
    .addSubcommand(command => command
        .setName("suggest")
        .setDescription("Suggest for a feature the bot should have")
        .addStringOption(option => option
            .setName("suggestion")
            .setDescription("The suggestion")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("bug-report")
        .setDescription("Report a bug")
        .addStringOption(option => option
            .setName("command")
            .setDescription("The not-working/bugging command")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("details")
            .setDescription("Describe the Problem (not required, you can leave that blank ) :)")
            .setRequired(false)
        )
    ),

    async execute (interaction, client) {
        const {options, guild, user} = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "suggest":

            const suggestion = options.getString("suggestion");
            const userx = user.id;
    
            const embed = new EmbedBuilder()
            .setTitle("NEW SUGGESTION!")
            .setColor(theme.theme)
            .addFields({ name:"User: ", value:`<@${userx}>`, inline: false})
            .addFields({ name:"Username:", value: `${user.username}#${user.tag}`, inline: false})
            .setDescription(`${suggestion}`)
            .setTimestamp()

            const a = new EmbedBuilder()
            .setTitle("Approved")
            .setDescription("The Feature has been approved")
            .addFields(
                {name: "Username:", value: `${user.tag}`, inline: true},
                {name: "Suggestion:", value: `${suggestion}`, inline: true}
            )
            .setColor(theme.theme)

            const b = new EmbedBuilder()
            .setTitle("Rejected")
            .setDescription("The Feature has been rejected")
            .addFields(
                {name: "Username:", value: `${user.tag}`, inline: true},
                {name: "Suggestion:", value: `${suggestion}`, inline: true}
            )
            .setColor("Red")

            const target = user;

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("1")
                .setLabel("Approve")
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId("2")
                .setLabel("Reject")
                .setStyle(ButtonStyle.Danger)
            )
            
            const xEmbed = new EmbedBuilder()
            .setTitle("You send us a suggestion!")
            .setDescription(`${suggestion}`)
            .setColor(theme.theme)
    
            const channel = client.channels.cache.get('1127249938502393897');
    
            const message = await channel.send({
                embeds: [embed],
                components: [buttons]
            }).catch(err => {
                return;
            });



            const collector = await message.createMessageComponentCollector();

            collector.on('collect', async i => {
                if (i.user.id != "931870926797160538") {
                    return await i.reply({
                        content: "You dont have the permission to execute this action!",
                        ephemeral: true
                    })
                }
                if (i.customId === "1") {
                    a.addFields({name: "Moderator:", value: `${i.user.tag}`, inline: true})

                    await target.send({ embeds: [a] }).catch(err => {i.reply({content: "I cant DM this user!", ephemeral: true}); console.log(err); });

                    embed.addFields({name: "Status:", value: `Approved`, inline: true})
                    await i.update({ embeds: [embed], components: [] });
                };

                if (i.customId === "2") {
                    a.addFields({name: "Moderator:", value: `${i.user.tag}`, inline: true})

                    await target.send({ embeds: [b] }).catch(err => {i.reply({content: "I cant DM this user!", ephemeral: true}); console.log(err); });

                    embed.addFields({name: "Status:", value: `rejected`, inline: true})
                    await i.update({ embeds: [embed], components: [] });
                };
            })
    
            await interaction.reply({ embeds: [xEmbed], ephemeral: true}).catch(err => {
                return;
            });
        break;
        case "bug-report":
            const USER = user.tag;
            const Command = options.getString("command");
            const BUG = options.getString("details") || "No details given!";
    
            const embedx = new EmbedBuilder()
            .setTitle("NEW REPORTED BUG!")
            .setDescription(`Bug: ${BUG}`)
            .addFields({ name: "Command", value: `${Command}`, inline: false})
            .addFields({ name: `user`, value: `${USER}`, inline: false})
            .setColor(theme.theme)
    
            const sendEmbed = new EmbedBuilder()
            .setTitle("YOU REPORTED A BUG!")
            .setColor(theme.theme)
            .setDescription(`Bug: ${BUG}`)
            .addFields({ name: "Command", value: `${Command}`})
            .setFooter({ text: "The Developer Team will contact you as fast as they can!"})
    
            const channelx = client.channels.cache.get('1127250005065994321');
    
            channelx.send({
                embeds: [embedx]
            }).catch(err => {
                return;
            });
    
            await interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(err => {
                return;
            });
        break;
        

        }
    }
}
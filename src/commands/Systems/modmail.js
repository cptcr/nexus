const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const modschema = require('../../Schemas.js/Modmail/modmail');
const moduses = require('../../Schemas.js/Modmail/modmailuses');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Configure your modmail system.')
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your modmail system for you.').addChannelOption(option => option.setName('category').setDescription('Specified category will receive your modmails.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables the modmail system for you.'))
    .addSubcommand(command => command.setName('close').setDescription('Closes your currently active modmail.')),
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'setup':

            if (!interaction.guild) return await interaction.reply({ content: `You **cannot** use this command in **DMs**!`, ephemeral: true})

            const data1 = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

            if (data1) return await interaction.reply({ content: `You have **already** set up the **modmail** in this server. \n> Do **/modmail disable** to undo.`, ephemeral: true });
            else {

                const category = await interaction.options.getChannel('category');

                const setupembed = new EmbedBuilder()
                .setColor(theme.theme)
                .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
                .setAuthor({ name: `📞 Modmail System`})
                .setFooter({ text: `📞 Modmail Setup`})
                .setTimestamp()
                .setTitle('> Modmail Enabled')
                .addFields({ name: `• Modmail was Enabled`, value: `> Your members will now be able to contact \n> you by sending me a direct message!`})
                .addFields({ name: `• Category`, value: `> ${category}`})

                await interaction.reply({ embeds: [setupembed] });

                await modschema.create({
                    Guild: interaction.guild.id,
                    Category: category.id
                })
            }

            break;
            case 'disable':

            if (!interaction.guild) return await interaction.reply({ content: `You **cannot** use this command in **DMs**!`, ephemeral: true})

            const data = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

            if (!data) return await interaction.reply({ content: `You have **not** set up the **modmail** in this server.`, ephemeral: true });
            else {

                const category = await interaction.options.getChannel('category');

                const setupembed = new EmbedBuilder()
                .setColor(theme.theme)
                .setThumbnail("https://cdn.discordapp.com/avatars/1046468420037787720/5a6cfe15ecc9df0aa87f9834de38aa07.webp")
                .setAuthor({ name: `📞 Modmail System`})
                .setFooter({ text: `📞 Modmail Removed`})
                .setTimestamp()
                .setTitle('> Modmail Disabled')
                .addFields({ name: `• Modmail was Disabled`, value: `> Your members will no longer be able to contact \n> you by sending me a direct message.`})

                await interaction.reply({ embeds: [setupembed] });
                await modschema.deleteMany({ Guild: interaction.guild.id })

            }

            case 'close':

            const usedata = await moduses.findOne({ User: interaction.user.id });

            if (!usedata) return await interaction.reply({ content: `You **do not** have an open **modmail**!`, ephemeral: true});
            else {

                const channel = await client.channels.cache.get(usedata.Channel);
                if (!channel) {

                    await interaction.reply({ content: `Your **modmail** has been **closed**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });

                } else {

                    await interaction.reply({ content: `Your **modmail** has been **closed** in **${channel.guild.name}**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });
                    await channel.send({ content: `⚠️ ${interaction.user} has **closed** their **modmail**!`});

                }
            }
        }
    }
}

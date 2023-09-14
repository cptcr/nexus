const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { NSFW } = require('nsfw-ts');
const nsfw = new NSFW();
const disabled = require("../../Schemas.js/Panel/NSFW/nsfw");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nsfw')
    .setNSFW(true)
    .setDMPermission(false)
    .setDescription('Uhm.. self explanatory!')
    .addSubcommand(command => command.setName('4k').setDescription('Shows a 4K "image".'))
    .addSubcommand(command => command.setName('ass').setDescription('Shows an ass image.'))
    .addSubcommand(command => command.setName('pussy').setDescription('Shows a pussy image.'))
    .addSubcommand(command => command.setName('boobs').setDescription('Shows some boobs.'))
    .addSubcommand(command => command.setName('anal').setDescription('Shows a picture of anal.'))
    .addSubcommand(command => command.setName('thigh').setDescription('Shows a picture of a thigh.'))
    .addSubcommand(command => command.setName('pgif').setDescription('Shows a porn gif.'))
    .addSubcommand(command => command.setName('hentai').setDescription('Shows a hentai image.')),
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        switch (sub) {

            case '4k':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const kimage = await nsfw.fourk()
            const kembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 4K Image Sent`})
            .setTitle('> One 4K Image coming up..')
            .setColor('DarkRed')
            .setImage(kimage)

            await interaction.editReply({ embeds: [kembed] })

            break;
            case 'ass':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const assimage = await nsfw.ass()
            const assembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 4K Image Sent`})
            .setTitle('> One Ass Image coming up..')
            .setColor('DarkRed')
            .setImage(assimage)

            await interaction.editReply({ embeds: [assembed] })

            break;
            case 'pussy':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const pussyimage = await nsfw.pussy()
            const pussyembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Ass Image Sent`})
            .setTitle('> One Pussy Image coming up..')
            .setColor('DarkRed')
            .setImage(pussyimage)

            await interaction.editReply({ embeds: [pussyembed] })

            break;
            case 'boobs':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const boobsimage = await nsfw.boobs()
            const boobsembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Boobs Image Sent`})
            .setTitle('> One Boobs Image coming up..')
            .setColor('DarkRed')
            .setImage(boobsimage)

            await interaction.editReply({ embeds: [boobsembed] })

            break;
            case 'anal':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const analimage = await nsfw.anal()
            const analembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Anal Image Sent`})
            .setTitle('> One Anal Image coming up..')
            .setColor('DarkRed')
            .setImage(analimage)

            await interaction.editReply({ embeds: [analembed] })

            break;
            case 'thigh':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const thighimage = await nsfw.thigh()
            const thighembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Thigh Image Sent`})
            .setTitle('> One Thigh Image coming up..')
            .setColor('DarkRed')
            .setImage(thighimage)

            await interaction.editReply({ embeds: [thighembed] })

            break;
            case 'pgif':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const pgifimage = await nsfw.pgif()
            const pgifembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Porn GIF Sent`})
            .setTitle('> One Porn GIF coming up..')
            .setColor('DarkRed')
            .setImage(pgifimage)

            await interaction.editReply({ embeds: [pgifembed] })

            break;
            case 'hentai':

            await interaction.deferReply();
            if (!interaction.channel.nsfw) return await interaction.reply({ content: `You **cannot** execute this command in a **non-nsfw** channel.`, ephemeral: true});

            const hentaiimage = await nsfw.hentai()
            const hentaiembed = new EmbedBuilder()
            .setAuthor({ name: `🔞 NSFW Playground`})
            .setFooter({ text: `🔞 Hentai Image Sent`})
            .setTitle('> One Hentai Image coming up..')
            .setColor('DarkRed')
            .setImage(hentaiimage)

            await interaction.editReply({ embeds: [hentaiembed] })

        }   
    }
}
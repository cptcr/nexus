const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const templateschema = require('../../Schemas.js/servertemplates');
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('template')
    .setDescription('Creates a loadable template of your server.')
    .setDMPermission(false)
    .addSubcommand(command => command.setName('load').setDescription('Loads a template. Use with caution..').addStringOption(option => option.setName('template-id').setDescription('Specified template will be loaded.').setRequired(true)))
    .addSubcommand(command => command.setName('create').setDescription('Creates a template (clone) of your server.')),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
        var timeout = [];
        var timeout1 = [];
        
        switch (sub) {
            case 'create':

            if (timeout.includes(interaction.member.id) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You are on cooldown! You **cannot** execute /template create.', ephemeral: true})

            timeout.push(interaction.user.id);
            setTimeout(() => {
                timeout.shift();
            }, 300000)

            await interaction.deferReply({ ephemeral: true });

            let channels = [];
            let roles = [];
            let emojis = [];
            let stickers = [];
            let categories = [];
            let icon = interaction.guild.iconURL() || 'none';
            let banner = interaction.guild.bannerURL() || 'none';
            let name = interaction.guild.name;

            let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
            let result = Math.floor(Math.random() * letter.length);
            let result2 = Math.floor(Math.random() * letter.length);
            let result3 = Math.floor(Math.random() * letter.length);
            let result4 = Math.floor(Math.random() * letter.length);
            let result5 = Math.floor(Math.random() * letter.length);
            let result6 = Math.floor(Math.random() * letter.length);
            let result7 = Math.floor(Math.random() * letter.length);
            let result8 = Math.floor(Math.random() * letter.length);
            let result9 = Math.floor(Math.random() * letter.length);
            let result10 = Math.floor(Math.random() * letter.length);
            let result11 = Math.floor(Math.random() * letter.length);
            let result12 = Math.floor(Math.random() * letter.length);
            let result13 = Math.floor(Math.random() * letter.length);
            let result14 = Math.floor(Math.random() * letter.length);
            let result15 = Math.floor(Math.random() * letter.length);
            let result16 = Math.floor(Math.random() * letter.length);

            let unique = interaction.guild.id + `-` + letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6] + letter[result7] + letter[result8] + letter[result9] + letter[result10] + letter[result11] + letter[result12] + letter[result13] + letter[result14] + letter[result15] + letter[result16];

            await Promise.all(interaction.guild.channels.cache.map(async channel => {
                if (channel.type === ChannelType.GuildCategory ) {
                    categories.push({ name: channel.name, id: channel.id })
                } else {
                    channels.push({ name: channel.name, parent: channel.parentId, type: channel.type.toString(), description: channel.topic })
                }
            }))

            await Promise.all(interaction.guild.roles.cache.map(async role => {
                roles.push({ name: role.name, color: role.hexColor, hoist: role.hoist})
            }))

            await Promise.all(interaction.guild.emojis.cache.map(async emoji => {
                emojis.push({ name: emoji.name, url: emoji.url })
            }))

            await Promise.all(interaction.guild.stickers.cache.map(async sticker => {
                stickers.push({ name: sticker.name, type: sticker.type, url: sticker.url, description: sticker.description })
            }))

            await templateschema.create({
                GuildBanner: banner,
                GuildIcon: icon,
                GuildName: name,
                Roles: roles || [],
                Channels: channels || [],
                ID: unique,
                Emojis: emojis || [],
                Stickers: stickers || [],
                Categories: categories || []
            })

            await interaction.editReply({ content: `Created a **template** of **${interaction.guild.name}**. \n\n> **Template ID:** ||${unique}||`, ephemeral: true });

            break;
            case 'load':

            if (timeout1.includes(interaction.member.id) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You are on cooldown! You **cannot** execute /template load.', ephemeral: true})

            timeout1.push(interaction.user.id);
            setTimeout(() => {
                timeout.shift();
            }, 3600000)

            let ID = await interaction.options.getString('template-id');

            let data = await templateschema.findOne({ ID: ID });
            if (!data) return await interaction.reply({ content: `That **template** does **not** exist :(`, ephemeral: true });
            else {

                await interaction.reply({ content: `**Loading** your template from "**${data.GuildName}**"!`, ephemeral: true })

                if (interaction.guild.roles) {
                    await Promise.all(interaction.guild.roles.cache.map(async role => {
                        try {
                            await role.delete()
                        } catch {}
                    }));
                }

                if (interaction.guild.emojis) {
                    await Promise.all(interaction.guild.emojis.cache.map(async emoji => {
                        try {
                            await emoji.delete()
                        } catch {}
                    }));
                }

                if (interaction.guild.stickers) {
                    await Promise.all(interaction.guild.stickers.cache.map(async sticker => {
                        try {
                            await sticker.delete()
                        } catch {}
                    }));
                }

                if (interaction.guild.channels) {
                    await Promise.all(interaction.guild.channels.cache.map(async channel => {
                        try {
                            await channel.delete();
                        } catch {}
                    }))
                }

                await Promise.all(data.Emojis.map(async emoji => {
                    try {
                        await interaction.guild.emojis.create({
                            name: emoji.name,
                            attachment: emoji.url
                        })
                    } catch {}
                }))

                let madecategories = [];
                await Promise.all(data.Categories.map(async category => {

                    try {
                        let channel = await interaction.guild.channels.create({
                            type: ChannelType.GuildCategory,
                            name: category.name
                        })
    
                        madecategories.push({ newid: channel.id, oldid: category.id })
                    } catch {}

                }))

                await Promise.all(data.Channels.map(async channel => {
                    
                    if (channel.parent) {
                        await Promise.all(madecategories.map(async category => {
                            if (category.oldid === channel.parent) {

                                try {
                                    interaction.guild.channels.create({
                                        name: channel.name,
                                        type: channel.type,
                                        parent: category.newid
                                    })
                                } catch {}

                            }
                        }))
                    } else {

                        try {
                            interaction.guild.channels.create({
                                name: channel.name,
                                type: channel.type
                            })
                        } catch {}
            
                    }

                }))

                await Promise.all(data.Roles.map(async role => {
                    try {
                        interaction.guild.roles.create({
                            name: role.name,
                            color: role.color,
                            hoist: role.hoist
                        })
                    } catch {}
                }))

                await Promise.all(data.Stickers.map(async sticker => {
                    try {
                        interaction.guild.stickers.create({
                            name: sticker.name,
                            attachment: sticker.url,
                            description: sticker.description,
                            type: sticker.type
                        })
                    } catch {}
                }))

                try{
                    await interaction.editReply({ content: `Your **template** finished **loading**!`})
                } catch {}

            }
        }
    }
}
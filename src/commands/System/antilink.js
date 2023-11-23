const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linkSchema = require('../../Schemas.js/linkSchema');
const disabled = require("../../Schemas.js/Panel/Systems/automod");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-link')
    .setDescription(`Setup and disable the anti link system`)
    .addSubcommand(command => 
        command
        .setName('setup')
        .setDescription(`Set up the anti link system to delete all links!`)
        .addStringOption(option => option.setName('permissions').setRequired(true).setDescription('Choose the permissions to BYPASS the anti link system')
        .addChoices(
            { name: 'Manage Channels', value: 'ManageChannels' },
            { name: 'Manage Server', value: 'ManageGuild' },
            { name: 'Embed Links', value: 'EmbedLinks'},
            { name: 'Attach Files', value: 'AttachFiles'},
            { name: 'Manage Messages', value: 'ManageMessages'},
            { name: 'Administrator', value: 'Administrator'}
        )))
    .addSubcommand(command => 
        command
            .setName(`disable`)
            .setDescription(`Disable the anti link system`))
    .addSubcommand(command => 
        command
            .setName(`check`)
            .setDescription(`Checks the status of the anti link system`))
    .addSubcommand(command => 
        command
        .setName(`edit`)
        .setDescription(`Edit your anti link permissions`)
        .addStringOption(option => option.setName('permissions').setRequired(true).setDescription('Choose the permissions to BYPASS the anti link system')
        .addChoices(
            { name: 'Manage Channels', value: 'ManageChannels' },
            { name: 'Manage Server', value: 'ManageGuild' },
            { name: 'Embed Links', value: 'EmbedLinks'},
            { name: 'Attach Files', value: 'AttachFiles'},
            { name: 'Manage Messages', value: 'ManageMessages'},
            { name: 'Administrator', value: 'Administrator'}
        ))),
    async execute (interaction) {
 
        const { options } = interaction;

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply({ content: `You must have the manage server permissions to manage the anti link system`, ephemeral: true});
 
        const sub = options.getSubcommand();
 
        switch (sub) {
 
            case 'setup':
            const permissions = options.getString('permissions');
 
            const Data = await linkSchema.findOne({ Guild: interaction.guild.id});
 
            if (Data) return await interaction.reply({ content: `You already have the link system setup, so /anti-link disable to remove it`, ephemeral: true});
 
            if (!Data) {
                linkSchema.create({
                    Guild: interaction.guild.id,
                    Perms: permissions
                })
            }
 
            const embed = new EmbedBuilder()
            .setColor(theme.theme)
            .setDescription(`:white_check_mark:  The anti link system has been enabled with the bypass permissions set to ${permissions}`)
 
            await interaction.reply({ embeds: [embed] });
        }
 
        switch (sub) {
 
            case 'disable':
            await linkSchema.deleteMany();
 
            const embed2 = new EmbedBuilder()
            .setColor(theme.theme)
            .setDescription(`:white_check_mark:  The anti link system has been disabled`)
 
            await interaction.reply({ embeds: [embed2] });
        }
 
        switch (sub) {
 
            case 'check':
            const Data = await linkSchema.findOne({ Guild: interaction.guild.id});
 
            if (!Data) return await interaction.reply({ content: `There is no anti link system set up here!`, ephemeral: true});
 
            const permissions = Data.Perms;
 
            if (!permissions) return await interaction.reply({ content: `There is no anti link system set up here`, ephemeral: true});
            else await interaction.reply({ content: `Your anti link system is currently set up.  People with the **${permissions}** permissions can bypass the system`, ephemeral: true});
        }
 
        switch (sub) {
 
            case 'edit':
            const Data = await linkSchema.findOne({ Guild: interaction.guild.id});
            const permissions = options.getString('permissions');
 
            if (!Data) return await interaction.reply({ content: `There is no anti link system set up here!`, ephemeral: true});
            else {
                await linkSchema.deleteMany();
 
                await linkSchema.create({
                    Guild: interaction.guild.id,
                    Perms: permissions
                })
 
                const embed3 = new EmbedBuilder()
                .setColor(theme.theme)
                .setDescription(`:white_check_mark:  Your anti link bypass permissions have now been set to ${permissions}`)
 
                await interaction.reply({ embeds: [embed3 ]});
            }
 
        }
 
    }
 
}
 
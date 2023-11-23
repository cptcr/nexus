const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const ghostSchema = require("../../Schemas.js/Ghostping/ghostpingSchema");
const numSchema  = require("../../Schemas.js/Ghostping/ghostnum");
const disabled = require("../../Schemas.js/Panel/Systems/automod");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-ghostping')
    .setDescription('Setup the anti ghost ping system')
    .addSubcommand(command => command.setName("setup").setDescription("Setup the anti ghost ping system"))
    .addSubcommand(command => command.setName("disable").setDescription("Disable the anti ghost ping system"))
    .addSubcommand(command => command.setName("number-reset").setDescription("Reset a users ghost ping count").addUserOption(option => option.setName("user").setDescription("The user you want to reset the number of ghost pings of").setRequired(true))),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have perms to manage the anti ghost ping system`, ephemeral: true});
 
        const { options } = interaction;
        const sub = options.getSubcommand();

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }
 
        const Data = await ghostSchema.findOne({Guild: interaction.guild.id});
        
        switch (sub) {
            case "setup":
 
            if (Data) return await interaction.reply({ content: `You already have the anti ghost ping system setup`, ephemeral: true});
            else {
                await ghostSchema.create({
                    Guild: interaction.guild.id
                })
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: The anti ghost ping system has been setup!`)
 
                await interaction.reply({ embeds: [embed] });
            }
 
            break;
 
            case "disable":
 
            if (!Data) return await interaction.reply({ content: `There is no anti ghost ping system setup here`, ephemeral: true});
            else {
                await ghostSchema.deleteMany({ Guild: interaction.guild.id});
 
                const embed = new EmbedBuilder()
                .setColor(theme.theme)
                .setDescription(":white_check_mark: The anti ghost ping system has been disabled")
 
                await interaction.reply({ embeds: [embed] });
            }
 
            break;
            
            case "number-reset":
 
            const member = options.getUser("user");
            const data = await numSchema.findOne({ Guild: interaction.guild.id, User: member.id});
 
            if (!data) return await interaction.reply({ content: `This member doesn't have any ghost pings yet`, ephemeral: true});
            else {
                await data.deleteOne({ User: member.id});
 
                await interaction.reply({ content: `${member}'s ghost ping number is back at 0`});
            }
        }
    }
}
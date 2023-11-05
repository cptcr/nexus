const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/reactRoleTest");
const theme = require("../../../embedConfig.json");
module.exports  = {
    data: new SlashCommandBuilder()
    .setName("react")
    .setDescription("Reactionroles")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption(option => option.setName("title").setDescription("Add a title").setRequired(true))
    .addStringOption(option => option.setName("description").setDescription("Add a description").setRequired(true))
    .addRoleOption(option => option.setName("channel").setDescription("Add a channel").setRequired(true))
    .addRoleOption(option => option.setName("role-1").setDescription("Add a role").setRequired(true))
    .addRoleOption(option => option.setName("role-2").setDescription("Add a role").setRequired(false))
    .addRoleOption(option => option.setName("role-3").setDescription("Add a role").setRequired(false))
    .addRoleOption(option => option.setName("role-4").setDescription("Add a role").setRequired(false))
    .addRoleOption(option => option.setName("role-5").setDescription("Add a role").setRequired(false)),

    async execute (interaction, client) {
        const {options, guild} = interaction;
        let channel = options.getChannel("channel");
        let title = options.getString("title");
        let desc = options.getString("description")

        const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setColor(theme.theme)

        const nums = [
            "1", "2", "3", "4", "5"
        ]

        const row = new ActionRowBuilder()

        const style = [
            ButtonStyle.Primary, //Blue
            ButtonStyle.Danger, //Red
            ButtonStyle.Success, //Green
            ButtonStyle.Secondary //Grey
        ]
 
        await nums.forEach(number => {
            const role = options.getRole(`role-${number}`)

            if (role) {
                const id = Date.now() + Math.floor(Math.random() * 1000);

                let Style = style[Math.floor(Math.random(style.length))]
    
                const button = new ButtonBuilder()
                .setCustomId(`${id}`)
                .setLabel(`${role.name}`)
                .setStyle(Style)
    
                row.addComponents(button)
    
                Schema.create({
                    ChannelID: channel.id,
                    CustomID: id,
                    RoleID: role.id,
                    Guild: interaction.guild.id,
                })
            } else {
                return;
            }
        })

        await interaction.reply({
            content: `Message succesfully created at <#${channel.id}>`,
            ephemeral: true
        })

        await channel.send({
            embeds: [embed],
            components: [row]
        })
    }
}
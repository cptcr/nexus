const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ButtonStyle, Embed, ActionRowBuilder } = require("discord.js");
const schema = require("../../Schemas.js/reactionrole");
const { ButtonBuilder } = require("@discordjs/builders");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Reactionrole")
    .addSubcommand(command => command
        .setName("add")
        .setDescription("add a reactionrole to your server")
        .addRoleOption(option => option.setName("role").setDescription("The role you want to give").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("The channel you want to send the message").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
        .addStringOption(option => option.setName("label").setDescription("The label for the button").setRequired(true))
        .addStringOption(option => option.setName("description").setDescription("The description of the embed").setRequired(false))
        .addStringOption(option => option.setName("title").setDescription("The title of the embed").setRequired(false))
        .addBooleanOption(option => option.setName("timestamp").setDescription("Do you want a timestamp?").setRequired(false))
        .addStringOption(option => option.setName("thumbnail").setDescription("Add a Thumbnail to your reactionrole (use imgur for the picture!)").setRequired(false))
        .addStringOption(option => option.setName("image").setDescription("Add a Image to your reactionrole (use imgur for the picture!)").setRequired(false))
        .addStringOption(option => option.setName("color").setDescription("Use a hex code for the color (example: #ffffff)").setRequired(false).setMinLength(7).setMaxLength(7))
        .addStringOption(option => option.setName("footer").setDescription("Add a footer to the embed").setRequired(false))
    )
    .addSubcommand(command => command
        .setName("edit")
        .setDescription("edit a reactionrole")
        .addStringOption(option => option.setName("message-id").setDescription("The message id from the reactionrole you want to edit").setRequired(true))
        .addRoleOption(option => option.setName("role").setDescription("The new role you want to add").setRequired(true))
    )
    .addSubcommand(command => command
        .setName("delete")
        .setDescription("delete a reactionrole in your server")
        .addStringOption(option => option.setName("message-id").setDescription("The id of the reactionrole message").setRequired(true))
    ),

    async execute (interaction, client) {
        const { options, guild } = interaction;
        const sub = options.getSubcommand()
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: "You dont have the permission to execute this command!",
                ephemeral: true
            })
        }
        switch (sub) {
            case "add":
                const role = options.getRole("role");
                const channel = options.getChannel("channel");
                const label = options.getString("label");
                const desc = options.getString("description") || `React with the button below to get the role ${role}!`;
                const title = options.getString("title") || "Reactionrole";
                const footer = options.getString("footer");
                const image = options.getString("image");
                const thumbnail = options.getString("thumbnail");
                const color = options.getString("color");
                const timestamp = options.getBoolean("timestamp");
                const finalEmbed = new EmbedBuilder()
                .setTitle(`${title}`)
                .setDescription(`${desc}`)
                
                function checkImgur(inputString) {
                    const imgurURLPrefix = "https://i.imgur.com/";
                    return inputString.startsWith(imgurURLPrefix);
                }
                if (timestamp) {
                    finalEmbed.setTimestamp()
                }
                if (footer) {
                    finalEmbed.setFooter({ text: `${footer}`})
                }
                if (image) {
                    if (checkImgur(image) === false) {
                        return await interaction.reply({
                            content: "Please use an https://i.imgur.com/ link!",
                            ephemeral: true
                        })
                    } else {
                        finalEmbed.setImage(`${image}`)
                    }
                }
                if (thumbnail) {
                    if (checkImgur(thumbnail) === false) {
                        return await interaction.reply({
                            content: "Please use an https://i.imgur.com/ link!",
                            ephemeral: true
                        })
                    } else {
                        finalEmbed.setThumbnail(`${thumbnail}`)
                    }
                }
                function getHexValue(hexColor) {
                    const parts = hexColor.split('#');
                    if (parts.length === 2) {
                      return parts[1];
                    } else {
                      return null;
                    }
                }
                if (color) {
                    const code = getHexValue(color);
                    finalEmbed.setColor(`${code}`)
                }
                const button = new ButtonBuilder()
                .setLabel(`${label}`)
                .setCustomId("reactionrole")
                .setStyle(ButtonStyle.Primary)
                const embed = new EmbedBuilder()
                .setTitle("Embed Created")
                .addFields(
                    {name: "Title:", value: title},
                    {name: "Description:", value: desc},
                    {name: "Role:", value: `${role}`},
                    {name: "Channel:", value: `${channel}`},
                    {name: "Label:", value: label}
                )
                const row = new ActionRowBuilder().addComponents(button)
                const message = await channel.send({
                    embeds: [finalEmbed],
                    components: [row]
                }).catch(err => {
                    interaction.reply({
                        content: `there was an error sending this message to ${channel}!`,
                        ephemeral: true
                    })

                    console.log(err)
                })
                await schema.create({
                    Guild: guild.id,
                    Message: message.id,
                    Role: role.id,
                    Channel: channel.id
                }).catch(err => {
                    interaction.reply({
                        content: `There was an error creating a schema in our database!`,
                        ephemeral: true
                    })
                })

                await interaction.reply({
                    embeds: [embed]
                })
            break;
            case "edit":
                const editRole = options.getRole("role");
                const editID = options.getString("message-id");
                const data = await schema.findOne({
                    Message: editID,
                    Guild: guild.id
                });
                if (!data) {
                    return await interaction.reply({
                        content: `I cant find a reactionrole with \`${editID}\`! Please make sure to execute this command in the correct server!`,
                        ephemeral: true
                    })
                } else if (data) {
                    await data.updateOne({
                        Guild: guild.id,
                        Message: editID,
                        Role: editRole.id
                    }).catch(err => {
                        interaction.reply({
                            content: "There was an error while trying to edit the reactionrole!",
                            ephemeral: true
                        });
                        console.log(err)
                    })
                    return await interaction.reply({
                        content: "The reactionrole has been successfully been edited!",
                        ephemeral: true
                    })
                }
            break;
            case "delete":
                const delID = options.getString("message-id");
                await schema.findOneAndDelete({ Guild: guild.id, Message: delID}).catch(async (err, data) => {
                    if (err) {
                        await console.log(err)
                        return interaction.reply({
                            content: "There was an error deleting the reactionrole!",
                            ephemeral: true
                        })
                    } else if (!data) {
                        return await interaction.reply({
                            content: "This reactionrole doesnt exist!",
                            ephemeral: true
                        })
                    }
                })
                await interaction.reply({
                    content: "The reactionrole has been deleted successfull!",
                    ephemeral: true
                })
            break;
        }
    }
}
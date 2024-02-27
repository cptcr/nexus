const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const warningSchema = require("../../Schemas.js/warnSchema");

const {generateRandomCode} = require("../../../functions");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn command")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("Create a warn")
        .addUserOption(o => o.setName("user").setDescription("the user you want to warn").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("the reason for the warn").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("list")
        .setDescription("Get a list of a users warns")
        .addUserOption(o => o.setName("user").setDescription("the user you want to get the warns").setRequired(false))
    )
    .addSubcommand(c => c
        .setName("info")
        .setDescription("Get a info about a warn")
        .addUserOption(o => o.setName("user").setDescription("the user you want to get the warn info").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("the warn id").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("edit")
        .setDescription("Edit a warn")
        .addUserOption(o => o.setName("user").setDescription("the user you want to get the warn info").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("the warn id").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("the reason for the warn").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("clear")
        .setDescription("Clear all warns of a user")
        .addUserOption(o => o.setName("user").setDescription("the user you want to get the warn info").setRequired(true))
    )
    .addSubcommand(c => c
        .setName("remove")
        .setDescription("Remove a users warn")
        .addUserOption(o => o.setName("user").setDescription("the user you want to get the warn info").setRequired(true))
        .addStringOption(o => o.setName("warn-id").setDescription("the warn id").setRequired(true))
    ),

    async execute (interaction, client) {
        const { guild, member, user, options } = interaction;

        if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
             return await interaction.reply({
                content: "You don't have the permission to do this!",
                ephemeral: true
            });
        }

        const subcommand = options.getSubcommand();
        //const targetUser = options.getUser("user");
        //const reason = options.getString("reason");
        //const warnId = options.getString("warn-id");

        switch (subcommand) {
            case "create":
                const t = options.getUser("user").id;
                const r = options.getString("reason");
                await addWarn(interaction, t, r);
                break;
            case "list":
                const e = options.getUser("user") || user;
                const eid = e.id;
                await listWarns(interaction, eid);
                break;
                case "info":
                    const w = options.getUser("user").id;
                    const wid = options.getString("warn-id");
                    await getWarnInfo(interaction, w, wid);
                    break;
            case "edit":
                const u = options.getUser("user").id;
                const wuid = options.getString("warn-id");
                const newReas = options.getString("reason");
                await editWarn(interaction, u, wuid, newReas);
                break;
            case "clear":
                const tar = options.getUser("user").id;
                await clearWarns(interaction, tar);
                break;
            case "remove":
                const c = options.getUser("user").id;
                const wcid = options.getString("warn-id");
                await removeWarn(interaction, c, wcid);
                break;
            default:
                await interaction.reply({ content: "Invalid subcommand!", ephemeral: true });
        }
    }
}

async function addWarn(interaction, targetUserId, reason) {
    const warningData = await warningSchema.findOneAndUpdate(
        { GuildID: interaction.guild.id, UserID: targetUserId },
        {
            $push: { 
                Content: {
                    ExecuterId: interaction.user.id,
                    ExecuterTag: interaction.user.tag,
                    Reason: reason,
                    WarnID: generateRandomCode(10),
                    Timestamp: Date.now()
                }
            }
        },
        { new: true, upsert: true }
    );

    const warnEmbed = new EmbedBuilder()
        .setColor('#FFA500') 
        .setTitle(`Warn Issued to ${targetUserId}`)
        .setDescription(`Reason: ${reason}`)
        .setTimestamp();

    await interaction.reply({ embeds: [warnEmbed] });
}

async function editWarn(interaction, targetUserId, warnId, newReason) {
    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
    const editEmbed = new EmbedBuilder().setColor('#FFA500'); 

    if (!warningData) {
        editEmbed.setTitle(`No Warnings`).setDescription(`User with ID ${targetUserId} has no warnings.`);
    } else {
        const warning = warningData.Content.find(w => w.WarnID === warnId);
        if (!warning) {
            editEmbed.setTitle(`Warning Not Found`).setDescription(`Warn ID ${warnId} not found.`);
        } else {
            const oldReason = warning.Reason;
            warning.Reason = newReason;
            warning.Edits = warning.Edits || [];
            warning.Edits.push({
                EditedByExecuterId: interaction.user.id,
                EditedByExecuterTag: interaction.user.tag,
                NewReason: newReason,
                OldReason: oldReason,
                EditTimestamp: Date.now()
            });

            await warningData.save();

            editEmbed.setTitle(`Warning Updated for User ID ${targetUserId}`)
                .setDescription(`**Warn ID:** ${warnId}\n**Old Reason:** ${oldReason}\n**New Reason:** ${newReason}`);
        }
    }

    await interaction.reply({ embeds: [editEmbed] });
}

async function clearWarns(interaction, targetUserId) {
    await warningSchema.findOneAndDelete({ GuildID: interaction.guild.id, UserID: targetUserId });
    const clearEmbed = new EmbedBuilder()
        .setColor('#00FF00') 
        .setTitle(`Warnings Cleared for User ID ${targetUserId}`)
        .setDescription(`All warnings have been cleared.`);

    await interaction.reply({ embeds: [clearEmbed] });
}

async function removeWarn(interaction, targetUserId, warnId) {
    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
    const removeEmbed = new EmbedBuilder().setColor('#00FF00');

    if (!warningData) {
        removeEmbed.setTitle(`No Warnings`).setDescription(`User with ID ${targetUserId} has no warnings.`);
    } else {
        const index = warningData.Content.findIndex(w => w.WarnID === warnId);
        if (index === -1) {
            removeEmbed.setTitle(`Warning Not Found`).setDescription(`Warn ID ${warnId} not found.`);
        } else {
            warningData.Content.splice(index, 1);
            await warningData.save();
            removeEmbed.setTitle(`Warning Removed for User ID ${targetUserId}`).setDescription(`Warn ID ${warnId} has been removed.`);
        }
    }

    await interaction.reply({ embeds: [removeEmbed] });
}

async function listWarns(interaction, targetUserId) {
    // Use 'getUser' instead of 'getString' for user options
    const targetUser = interaction.options.getUser('user');
    const targetUserd = targetUser ? targetUser.id : interaction.user.id; // Default to the command user if no user is provided

    const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserd });
    const listEmbed = new EmbedBuilder().setColor('#0099ff');

    if (!warningData || !warningData.Content.length) {
        listEmbed.setTitle(`No Warnings`).setDescription(`User with ID ${targetUserd} has no warnings.`);
    } else {
        const warnIDs = warningData.Content.map(w => w.WarnID).join(', ');
        listEmbed.setTitle(`Warnings for User ID ${targetUserd}`).setDescription(`Warn IDs: ${warnIDs}`);
    }

    await interaction.reply({ embeds: [listEmbed] });
}

async function getWarnInfo(interaction, targetUserId, warnId) {
    try {
        // Log the received User ID and Warn ID for debugging

        const warningData = await warningSchema.findOne({ GuildID: interaction.guild.id, UserID: targetUserId });
        
        // Log the retrieved warning data

        const infoEmbed = new EmbedBuilder().setColor('#0099ff');

        if (!warningData) {
            infoEmbed.setTitle(`No Warnings`).setDescription(`User with ID ${targetUserId} has no warnings.`);
        } else {
            const warning = warningData.Content.find(w => w.WarnID === warnId);

            // Log the specific warning found

            if (!warning) {
                infoEmbed.setTitle(`Warning Not Found`).setDescription(`Warn ID ${warnId} not found.`);
            } else {
                infoEmbed.setTitle(`Warning Info for User ID ${targetUserId}`)
                    .setDescription(`**Warn ID:** ${warnId}\n**Issued by:** ${warning.ExecuterTag}\n**Reason:** ${warning.Reason}\n**Issued on:** <t:${Math.floor(warning.Timestamp / 1000)}:f>`);
                
                if (warning.Edits) {
                    let count = 0;
                    warning.Edits.forEach(edit => {
                        count++;
                        infoEmbed.addFields(
                            {name: `Edit ${count}:`, value: `**Edited by:** <@${edit.EditedByExecuterId}> \n**Old Reason:** ${edit.OldReason} \n**New Reason:** ${edit.NewReason} \n**Edited at:** <t:${edit.Timestamp}:f>`}
                        )
                    })
                }
            }
        }

        await interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
        // Log any errors that occur
        console.error("Error in getWarnInfo:", error);
        await interaction.reply({ content: "An error occurred while retrieving warning information.", ephemeral: true });
    }
}
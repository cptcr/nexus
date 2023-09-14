const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const guildBlacklist = require("../../Schemas.js/Blacklist/blacklistserver");
const userBlacklist = require("../../Schemas.js/Blacklist/blacklist");
const toowake = "931870926797160538";
const justin = "822111322548076624";

module.exports = {
    data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Add a guild / user to the blacklist")
    .addSubcommandGroup(group => group
        .setName("guild")
        .setDescription("guild blacklist")
        .addSubcommand(command => command
            .setName("g-add")
            .setDescription("add a guild to the blacklist")
            .addStringOption(option => option.setName("id").setDescription("the id of the guild").setRequired(true))
            .addStringOption(option => option.setName("mod-note").setDescription("Add a reason / mod-note").setRequired(false))
        )
        .addSubcommand(command => command
            .setName("g-remove")
            .setDescription("remove a guild from the blacklist")
            .addStringOption(option => option.setName("id").setDescription("the id of the guild").setRequired(true))
            .addStringOption(option => option.setName("mod-note").setDescription("Add a reason / mod-note").setRequired(false))
        )
    )
    .addSubcommandGroup(group => group
        .setName("user")
        .setDescription("guild blacklist")
        .addSubcommand(command => command
            .setName("u-add")
            .setDescription("add a user to the user")
            .addStringOption(option => option.setName("id").setDescription("the id of the user").setRequired(true))
            .addStringOption(option => option.setName("mod-note").setDescription("Add a reason / mod-note").setRequired(false))
        )
        .addSubcommand(command => command
            .setName("u-remove")
            .setDescription("remove a user from the blacklist")
            .addStringOption(option => option.setName("id").setDescription("the id of the user").setRequired(true))
            .addStringOption(option => option.setName("mod-note").setDescription("Add a reason / mod-note").setRequired(false))
        )
    ),

    async execute (interaction, client) {
        const {user, options} = interaction;

        if (user.id !== toowake && user.id !== justin) {
            return await message.reply({
              content: "❌ You **do not** have permission to do that!",
            });
        }

        const sub = options.getSubcommand();
        const embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("White")
        .setFooter({ text: "Nexus Blacklist System"})
        .addFields(
            {name: "Moderator:", value: `<@${user.id}>`, inline: false}
        )

        const channelID = "1135497865351929887";
        const channel = await client.channels.cache.get(channelID);

        switch (sub) {
            case "g-add":
                const guildAdd = options.getString("id");
                const guildAddReason = options.getString("mod-note") || "No reason / note";

                const dataGuildAdd = await guildBlacklist.findOne({ Guild: guildAdd});

                if (dataGuildAdd) {
                    await interaction.reply({
                        content: `The guild **${guildAdd}** has already been blacklisted with **${dataGuildAdd.Reason || "No reason given"}**!`,
                        ephemeral: true
                    })
                } else {
                    embed.setTitle("Blacklist Added")
                    .addFields(
                        {name: "GuildID:", value: `${guildAdd}`, inline: false},
                        {name: "Note:", value: `${guildAddReason}`, inline: false},
                    )

                    await channel.send({ embeds: [embed] });
                    await guildBlacklist.create({ Guild: guildAdd, Reason: guildAddReason, Moderator: user.username})
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            break;
            case "g-remove":
                const guildRemove = options.getString("id");
                const guildRemoveReason = options.getString("mod-note") || "No reason / note";

                const dataGuildRemove = await userBlacklist.findOne({ Guild: guildRemove});

                if (dataGuildRemove) {
                    await userBlacklist.deleteMany({ Guild: guildRemove});
                    
                    embed.setTitle("Blacklist Removed")
                    .addFields(
                        {name: "GuildID:", value: `${guildRemove}`, inline: false},
                        {name: "Note:", value: `${guildRemoveReason}`, inline: false},
                    )
                    await channel.send({ embeds: [embed] });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply({
                        content: `I cant find the guild **${guildRemove}**!`
                    })
                }
            break;
            case "u-add":
                const userAdd = options.getString("id");
                const userAddReason = options.getString("mod-note") || "No reason / note";

                const dataUserAdd = await userBlacklist.findOne({ Guild: userAdd});

                if (dataUserAdd) {
                    await interaction.reply({
                        content: `The user **${userAdd}** has already been blacklisted with **${dataUserAdd.Reason || "No reason given"}**!`,
                        ephemeral: true
                    })
                } else {
                    embed.setTitle("Blacklist Added")
                    .addFields(
                        {name: "UserID:", value: `${userAdd}`, inline: false},
                        {name: "Note:", value: `${userAddReason}`, inline: false},
                    )

                    await channel.send({ embeds: [embed] });
                    await userBlacklist.create({ User: userAdd, Reason: userAddReason, Moderator: user.username})
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            break;
            case "u-remove":
                const userRemove = options.getString("id");
                const userRemoveReason = options.getString("mod-note") || "No reason / note";

                const dataUserRemove = await userBlacklist.findOne({ User: userRemove});

                if (dataUserRemove) {
                    await userBlacklist.deleteMany({ User: userRemove});
                    
                    embed.setTitle("Blacklist Removed")
                    .addFields(
                        {name: "UserID:", value: `${userRemove}`, inline: false},
                        {name: "Note:", value: `${userRemoveReason}`, inline: false},
                    )
                    await channel.send({ embeds: [embed] });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply({
                        content: `I cant find the user **${userRemove}**!`
                    })
                }
            break;
        }
    }
}
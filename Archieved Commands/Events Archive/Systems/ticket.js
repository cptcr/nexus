/// TICKET SYSTEM //
const ticketSchema = require("../../../src/Schemas.js/ticketSchema");
const {client} = require("../../../src/index");
const {Events, ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require("discord.js");
const theme = require("../../../embedConfig.json");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;


      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: "1046468420037787720",
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          }
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor(theme.theme)
          .setTitle("Ticket Opened")
          .setDescription(`Welcome to your ticket ${interaction.user.username}\n React with 🔒 to close the ticket`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })

          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('<:mod:1135253601221083166>'),
            new ButtonBuilder()
            .setCustomId("claim")
            .setLabel("Claim")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("lock")
            .setLabel("lock")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setLabel("unlock")
            .setCustomId("unlock")
            .setEmoji("<:mod:1135253601221083166>")
            .setStyle(ButtonStyle.Success)
          )

          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })

          const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket created in <#${channel.id}>`)

          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }

    if (customId === "claim") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setTitle("Ticket has been claimed!")
        .addFields(
            {name: "Moderator:", value: `<@${interaction.user.id}>`, inline: true}
        )
        .setColor(theme.theme)
        .setTimestamp()

        await interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed]});

        await interaction.reply({ content: "**claimed** channel **successfull!**", ephemeral: true});
    }

    if (customId === "lock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`This channel has been **LOCKED** by <@${interaction.user.id}>!`)
        .setColor("Red")
        
        await interaction.channel.send({ embeds: [embed]})

        await interaction.reply({ content: "**locked** channel **successfull!**", ephemeral: true});
    }

    if (customId === "unlock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "You cant do this!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`This channel has been **UNLOCKED** by <@${interaction.user.id}>!`)
        .setColor("Green")
        
        await interaction.channel.send({ embeds: [embed]});

        await interaction.reply({ content: "**unlocked** channel **successfull!**", ephemeral: true});
    }

    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 are you sure you want to close this ticket?')
      .setColor('Red')

      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),

        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )

      await interaction.reply({ embeds: [closingEmbed], components: [buttons], ephemeral: true })
    }

    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Closed by`, value: `${interaction.user.tag}`}
      )
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })

      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Red')

      await interaction.reply({ embeds: [processEmbed] })

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
     }

     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Ticket close cancelled')
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})
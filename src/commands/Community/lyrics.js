const {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
      .setName("lyrics")
      .setDescription("Displays the lyrics from the given song")
      .setDMPermission(false)
      .addStringOption((options) =>
        options
          .setName("song")
          .setDescription(
            "What is the song? You can also include the artist for a better search!"
          )
          .setRequired(true)
      ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const song = interaction.options.getString("song");
  
      await interaction.deferReply();
  
      try {
        let { body } = await superagent.get(
          `https://some-random-api.ml/others/lyrics?title=${song}`
        );
  
        const MAX_CHARS = 1024;
        let lyrics = body.lyrics;
        const lyricFields = [];
  
        while (lyrics.length) {
          lyricFields.push({
            name: "Lyrics:",
            value: lyrics.substring(0, MAX_CHARS),
          });
          lyrics = lyrics.substring(MAX_CHARS);
        }
  
        const lyricembed = new EmbedBuilder()
          .setTitle("Your Lyrics")
          .setColor(theme.theme)
          .setThumbnail(body.thumbnail.genius)
          .setURL(body.links.genius)
          .setAuthor({
            name: `${interaction.member.user.tag}`,
            iconURL: `${interaction.member.displayAvatarURL()}`,
          })
          .addFields(
            {
              name: "Title:",
              value: `${body.title}`,
              inline: true,
            },
            {
              name: "Artist:",
              value: `${body.author}`,
              inline: true,
            },
            ...lyricFields
          )
          .setFooter({ text: `Disclaimer - ${body.disclaimer}` });
  
        interaction.followUp({ embeds: [lyricembed] });
      } catch (error) {
        interaction.followUp({ content: "An error occured, try again later!" });
      }
    },
  };
  
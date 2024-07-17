const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuider, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const theme = require("../../../embedConfig.json");
module.exports = {
  data: {
      name: "google",
      description: "Google something",
      "integration_types": [0, 1],
      "contexts": [0, 1, 2],
      options: [
          {
              name: "query",
              required: true,
              type: 3,
              description: "What do you want to search?"
          },
      ]
  },
  /**
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const topic = interaction.options.getString("topic").slice().split(" ")
    const search = topic.join("+")
    const row  = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setLabel("Google Search")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://google.com/search?q=${search}`)
    );
    
    const embed = new EmbedBuilder()
    .setTitle("Google")
    .setColor(theme.theme)
    .setDescription(`Click [here](https://google.com/search?q=${search}) or the button  below me to view your google search`)
    interaction.reply({ embeds: [embed], components: [row], ephemeral: true})
  }
}
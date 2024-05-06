const { SlashCommandBuilder } = require("discord.js");
const dadJokes = require("../../../dadjoke.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadjoke")
    .setDescription("Get a random dad joke"),

  async execute(interaction) {
    const randomIndex = Math.floor(Math.random() * dadJokes.dadJokes.length);
    const randomJoke = dadJokes.dadJokes[randomIndex].joke;

    await interaction.reply(randomJoke);
  },
};

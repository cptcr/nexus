const { EmbedBuilder, Events } = require('discord.js');
const theme = require("../../../embedConfig.json");
const os = require("os");
const si = require("systeminformation");

module.exports = async (client) => {
    // Interaction handler
    client.on(Events.InteractionCreate, async (i) => {
      try {
        const interaction = i;
          if (!interaction.isButton()) return;  // Ensure the interaction is a button click
          
          // Embed for rules

      } catch (error) {
        return;
      }
    });
};

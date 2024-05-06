const { Events, EmbedBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
const maintenance = require("../../Schemas.js/main");

module.exports = async (client) => {
  client.on(Events.MessageCreate, async (message) => {
    const { author, channel, guild } = message;

    const content = message.content.toLowerCase();

    const prefixx = "n! ";
    const prefix = prefixx.toLowerCase();

    if (content.startsWith(prefix)) {
      if (!process.env.OWNERID.includes(author.id)) {
        return;
      } else {
        if (content.startsWith(`${prefix}maintenance enable`)) {
          const data = await maintenance.findOne({
            Type: "Main",
          });

          if (data) {
            await message.reply({
              content: "Maintenance is already online!",
            });
          } else {
            await maintenance.create({
              Type: "Main",
            });

            await message.reply({
              content: "Maintenace enabled, you can code now!",
            });

            console.log("Maintenance: Enabled");
          }
        } else if (content.startsWith(`${prefix}maintenance disable`)) {
          const data = await maintenance.findOne({
            Type: "Main",
          });

          if (data) {
            await maintenance.deleteMany({
              Type: "Main",
            });

            await message.reply({
              content: "Maintenance has been disabled!",
            });

            console.log("Maintenance: Disabled");
          } else {
            await message.reply({ content: "Maintenace is already disabled!" });
          }
        }
      }
    }
  });
};

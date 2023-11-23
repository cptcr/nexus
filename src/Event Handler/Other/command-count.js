const { EmbedBuilder, Events } = require('discord.js')
const theme = require("../../../embedConfig.json");
const cmdCount = require("../../Schemas.js/commandCount");

module.exports = async (client) => {
    //command count
    
    client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction) {
        const data = await cmdCount.findOne({ ID: "1046468420037787720"});
    
        if (!data) {
          await cmdCount.create({
            ID: "1046468420037787720",
            CC: 1
          })
        } else if (data) {
          data.CC += 1;
          await data.save()
        }
      }
    })
}
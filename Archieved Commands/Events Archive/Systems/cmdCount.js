const cmdCount = require("../../../src/Schemas.js/commandCount");
const {client} = require("../../../src/index");
const {Events} = require("discord.js");
const theme = require("../../../embedConfig.json");
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

      console.log(data.CC)
    }
  }
})
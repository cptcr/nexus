const { Events, EmbedBuilder } = require("discord.js")
const theme = require("../../../embedConfig.json");
const developers = require("../../../owner.json");
const maintenance = require("../../Schemas.js/main");

module.exports = async (client) => {
    client.on(Events.MessageCreate, async message => {
        const { author, channel, guild, content } = message;

        const prefix = "n! "
        
        if (message.content.startsWith(prefix)) {
            if (!developers.owners.includes(author.id)) {
                return;
            } else {
                if (content.startsWith(`${prefix}maintenance enable`)) {
                    const data = await maintenance.findOne({
                        Type: "Main"
                    })

                    if (data) {
                        await message.reply({
                            content: "Maintenance is already online!"
                        })
                    } else {
                        await maintenance.create({
                            Type: "Main"
                        })

                        await message.reply({ content: "Maintenace enabled, you can code now!"})

                        console.log("Maintenance: Enabled")
                    }
                } else if (content.startsWith(`${prefix}maintenance disable`)) {
                    const data = await maintenance.findOne({
                        Type: "Main"
                    })

                    if (data) {
                        await maintenance.deleteMany({
                            Type: "Main"
                        })

                        await message.reply({
                            content: "Maintenance has been disabled!"
                        })

                        console.log("Maintenance: Disabled")
                    } else {
                        await message.reply({ content: "Maintenace is already disabled!"})
                    }
                }
            }
        } 
    })
}
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const Schemas = require("../../Schemas.js/")
const fs = require("fs");
const { error } = require("console");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("get-data")
    .setDescription("Get all data saved"),

    async execute (interaction) {
        const { user } = interaction;

        const embed = new EmbedBuilder()
        .setTitle("Your Data")
        .setDescription("Get your data here")
        .setColor("White")

        const select = new StringSelectMenuBuilder()

        let string = {};

        for (const scheme of Schemas) {
            const schemaFiles = fs.readdirSync("../../Schemas.js/").filter(file => file.endsWith('.js'));

            if (error) {
                return;
            } else {
                schemaFiles.forEach(f => {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                        .setLabel(`${schemaFiles}`)
                        .setDescription("Get data")
                        .setEmoji("<:nexus_disk:1165285274167816295>")
                    )

                    

                    const t = new EmbedBuilder()
                    .setDescription()
                })
            }
        }
    }
}
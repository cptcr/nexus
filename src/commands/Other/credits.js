const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const theme = require("../../../embedConfig.json");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Credits to all the people who helped me"),

    async execute (interaction) {
        const embed = new EmbedBuilder()
        .setTitle("Credits")
        .setDescription("A **BIG** thanks to all the people who helped me creating this discord bot :>")
        .addFields(
            {name: "d3rjust1n", value: "helping by a few errors, Joinrole System", inline: true},
            {name: "＊•̩̩͙✩•̩̩͙˚ 𝓛𝓲𝔃𝔃𝔂 ˚•̩̩͙✩•̩̩#0001", value: "Ticket System", inline: false},
            {name: "jaso0on", value: "Join to Create System, Ant Ghost, Giveaway System, Fixing Errors, Autoreply"},
            {name: "jackson.", value: "The person who teached me discord.js and helped by creating much commands", inline: true},
            {name: "Silvxr#4284", value: "helped fixing errors", inline: true},
            {name: "Cookie 🍪#1270", value: "helped fixing errors", inline: true},
            {name: "nobcop", value: "helped fixing errors, /add-role", inline: true},
            {name: "vanitydev", value: "helped fixing erros", inline: true},
            {name: "scooby#2210", value: "The annoying one <@844951775106433024>", inline: true},
            {name: "springles.", value: "Helped fixing /spotify", inline: true},
            {name: "thelegendev", value: "helped fixing /spotify", inline: true},
            {name: "KookiePanda#1455", value: "helped fixing /spotify", inline: true},
            {name: "tomdevv", value: "Celsius-Fahrenheit Converter", inline: true},
            {name: "fuzzx", value: "Autoreply", inline: true},
            {name: "Banners by", value: "[auto creative](https://auto.creative.co)", inline: true},
            {name: "Nexus Hosting Team", value: "\ntoowake: Owner \nSoy Daddy: Developer \nJason: Web Design & Development \nJustin: Server Security", inline: false}
        )
        .setTimestamp()
        .setColor(theme.theme)
        .setFooter({ text: "Rishaune loves feet"})
        .setThumbnail("https://images-ext-1.discordapp.net/external/Ezs7lCgEij7abLzWyzOIZJGSOaGXlaQYVYgmjWZt3zQ/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/932262724258398219/4ccecca9f584de0f84ab9c8c72de71c9.webp")
        .setImage("https://images-ext-1.discordapp.net/external/Ezs7lCgEij7abLzWyzOIZJGSOaGXlaQYVYgmjWZt3zQ/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/932262724258398219/4ccecca9f584de0f84ab9c8c72de71c9.webp")
        
        await interaction.reply(
            {
                embeds: [embed]
            }
        )
    }
}
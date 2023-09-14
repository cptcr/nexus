const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
            {name: "Guddi#9552", value: "Owner of the hosting service from the bot", inline: true},
            {name: "scooby#2210", value: "The annoying one <@844951775106433024>", inline: true},
            {name: "springles.", value: "Helped fixing /spotify", inline: true},
            {name: "thelegendev", value: "helped fixing /spotify", inline: true},
            {name: "KookiePanda#1455", value: "helped fixing /spotify", inline: true},
            {name: "tomdevv", value: "Celsius-Fahrenheit Converter", inline: true},
            {name: "fuzzx", value: "Autoreply", inline: true},
            {name: "Banners by", value: "[auto creative](https://auto.creative.co)", inline: true}
        )
        .setTimestamp()
        .setColor("Purple")
        .setImage("https://share.creavite.co/wjQ5hoNiHfXFiwqN.gif")
        
        await interaction.reply(
            {
                embeds: [embed]
            }
        )
    }
}
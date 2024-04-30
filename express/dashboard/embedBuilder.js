const { MessageEmbed } = require('discord.js');




module.exports = async (app) => {
    app.post('/:guildId/embed-builder', (req, res) => {
    const { guildId } = req.params;
    const { title, description, color, footer, image } = req.body;

    // Assuming you have a way to fetch the client and guild
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.find(channel => channel.name === "target-channel-name");

    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter(footer)
        .setImage(image);

    channel.send({ embeds: [embed] });

    res.redirect(`/dashboard/${guildId}`);
    });

}
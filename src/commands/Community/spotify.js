const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, Embed } = require('discord.js');
const canvacord = require('canvacord');
const theme = require("../../../embedConfig.json");
module.exports = {
   data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('see a users current spotify status')
    .addUserOption(option => option.setName('user').setDescription('see a users current spotify status').setRequired(true)),
    async execute(interaction) {

        const embed = new EmbedBuilder({
            title: "toowake's Spotify Status",
        }).setImage("https://cdn.discordapp.com/attachments/970775929481744423/1202645106851848292/spotify.png?ex=65ce3589&is=65bbc089&hm=751264f6c3ef8f6c102849a8a174a941178c00a803273b729963def1abdea99a&")

        return await interaction.reply({
            embeds: [embed]
        })
 
        /*let user = interaction.options.getMember('user');
 
        if (user.bot) return interaction.reply({ content: 'a bot does not have a spotify status', ephemeral: true});
 
        let status;
        if(user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];
 
        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            return await interaction.reply({ content: `${user.user.username} is not listening to spotify`, ephemeral: true});
        }
 
        if (status !== null && status.name === "Spotify" && status.assets !== null) {
 
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state,
            album = status.assets.largeText;
 
            const card = new canvacord.Spotify()
            .setAuthor(artist)
            .setAlbum(album)
            .setStartTimestamp(status.timestamps.start)
            .setEndTimestamp(status.timestamps.end)
            .setImage(image)
            .setTitle(name)
 
            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: "spotify.png" });
 
            
 
            await interaction.reply({files: [attachments] })
        } */
    }
}
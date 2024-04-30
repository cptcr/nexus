const {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");
const theme = require("../../../embedConfig.json");

module.exports = {
    data: {
        name: "lyrics",
        description: "Displays the lyrics from the given song",
        "integration_types": [0, 1],
        "contexts": [0, 1, 2],
        options: [
            {
                name: "song",
                required: true,
                type: 3,
                description: "What is the song? You can also include the artist for a better search!"
            },
        ]
    },
    async execute(interaction) {
        const song = interaction.options.getString("song");

        await interaction.deferReply();

        try {
            let { body } = await superagent.get(`https://some-random-api.ml/others/lyrics?title=${encodeURIComponent(song)}`);

            if (!body.lyrics) {
                await interaction.editReply({ content: "Lyrics not found for the given song. Try specifying the song and artist name for a better search." });
                return; // Exit if no lyrics are found
            }

            const MAX_CHARS = 1024;
            let lyrics = body.lyrics;
            const lyricFields = [];

            // Split lyrics into segments that fit within the embed field value limit
            while (lyrics.length > 0) {
                if (lyrics.length < MAX_CHARS) {
                    lyricFields.push({
                        name: '\u200B', // Use an invisible character if you prefer not to have a field name
                        value: lyrics.substring(0, lyrics.length),
                    });
                    break; // Exit loop if the rest of the lyrics fit in one segment
                } else {
                    let segment = lyrics.substring(0, MAX_CHARS);
                    lyrics = lyrics.substring(MAX_CHARS);
                    lyricFields.push({
                        name: '\u200B', // Use an invisible character if you prefer not to have a field name
                        value: segment,
                    });
                }
            }

            const lyricembed = new EmbedBuilder()
                .setTitle(body.title || "Lyrics Not Found")
                .setColor(theme.theme)
                .setThumbnail(body.thumbnail?.genius || '')
                .setURL(body.links?.genius || '')
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .addFields(lyricFields)
                .setFooter({ text: `Disclaimer - Lyrics provided may not be accurate.` });

            await interaction.editReply({ embeds: [lyricembed] });
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.editReply({ content: "An error occurred, try again later." });
        }
    },
};

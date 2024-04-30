const Transcript = require("../../src/Schemas.js/transcript/list");
module.exports = async (app) => {
    app.get('/:guildId/transcripts', async (req, res) => {
    const { guildId } = req.params;

    try {
        const transcripts = await Transcript.find({ guildId }).sort({ createdAt: -1 });

        // Render an EJS template with the transcripts
        // Ensure 'transcriptsList' is correctly named and exists in your views directory
        res.render('transcriptsList', { transcripts, guildId });
    } catch (error) {
        console.error("Error fetching transcripts:", error);
        res.status(500).send("Internal Server Error");
    }
    });
}
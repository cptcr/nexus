const Transcript = require("../../src/Schemas.js/transcript/list");
module.exports = async (app) => {
    app.get('/:guildId/transcripts/:transcriptId', async (req, res) => {
    const { guildId, transcriptId } = req.params;
    try {
        const transcript = await Transcript.findOne({ _id: transcriptId, guildId: guildId });
        if (!transcript) {
            return res.status(404).send('Transcript not found.');
        }
        // Assuming you have an EJS view named 'transcriptDetails.ejs' that can display the transcript
        res.render('transcriptDetails', { transcript });
    } catch (error) {
        console.error("Error fetching transcript:", error);
        res.status(500).send("Internal Server Error");
    }
    });
}
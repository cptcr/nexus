const streamSchema = require('../../src/Schemas.js/streamSchema');

module.exports = async (app) => {
    //view streamplan
    app.get("/:guildId/streamplan", async (req, res) => {
    const { guildId } = req.params;
    try {
        const streamPlanData = await streamSchema.findOne({ Guild: guildId });
        if (!streamPlanData) {
            return res.status(404).send("No stream plan found for the specified guild.");
        }

        // Render the stream plan page with the fetched data
        res.render('streamplan', { streamPlan: streamPlanData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }});
}
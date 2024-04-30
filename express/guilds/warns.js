const warnSchema = require('../../src/Schemas.js/warnSchema');
module.exports = async (app) => {
    app.get("/:guildId/warns/:userId", async (req, res) => {
    const { guildId, userId } = req.params;
    try {
        const warnData = await warnSchema.findOne({ GuildID: guildId, UserID: userId });
        if (!warnData) {
            return res.status(404).send("No warnings found for the specified user.");
        }

        const warnings = warnData.Content.map(warn => ({
            warnId: warn.WarnID,
            moderator: warn.ExecuterTag,
            reason: warn.Reason,
            date: new Date(warn.Timestamp).toLocaleString(),
        }));

        res.render('warnPage', { warnings }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
}
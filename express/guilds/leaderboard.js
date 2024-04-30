const lead = require('../../src/Schemas.js/Leveling/level'); 

module.exports = async (app) => {
    app.get("/:guildId/leaderboard", async (req, res) => {
    try {
        const { guildId } = req.params;
        const leaderboardData = await lead.find({ Guild: guildId }).sort({ XP: -1 }).limit(10);
        const usersWithDetails = await Promise.all(leaderboardData.map(async (user) => {
            const client = require("../../src/index").client;
            const discordUser = await client.users.fetch(user.User); 
            return {
                avatarUrl: discordUser.displayAvatarURL(),
                username: discordUser.username,
                level: user.Level,
                xp: user.XP
            };
        }));
        res.render('leaderboardPage', { leaderboard: usersWithDetails });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
}

module.exports = async (app) => {
    app.get('/', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/discord');
    const userGuilds = req.user.guilds.filter(guild => (guild.permissions & 0x8) === 0x8);
        res.render('dashboard', { user: req.user, guilds: userGuilds });
    });

}
const passport = require('passport');

module.exports = async (app) => {
app.get('/discord', passport.authenticate('discord'));

app.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard'); // Redirect to the dashboard on success
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
}
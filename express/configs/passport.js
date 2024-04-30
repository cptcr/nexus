const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

module.exports = async (app) => {

// Session setup
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.ID,
    clientSecret: process.env.SECRET,
    callbackURL: `http://${process.env.DOMAIN || "localhost"}:${process.env.PORT}/auth/discord/callback`,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

}
const facebookStrategy = require("passport-facebook");
const fbconfig = require("../../config/Oauthfacebook");
const User = require("../../models/User");
const genToken = require("../../utils/lib");
const passport = require('passport');
const FortyTwoStrategy = require('passport-42').Strategy;
const gitconfig = require("../../config/Oauthgithub");
const GitHubStrategy = require('passport-github').Strategy;
const fortytwoconfig = require('../../config/Oauth42');

// Facebook
// Connect to facebook app id
passport.use(new facebookStrategy({
    clientID: fbconfig.facebook.clientID,
    clientSecret: fbconfig.facebook.clientSecret,
    callbackURL: fbconfig.facebook.callbackURL,
    profileFields: [ 'id', 'emails', 'name', 'picture.type(large)' ]
},
function(profile, done) {
    // Check if facebook's email is already registered on an account
    User.findOne({ oauthID: profile.email }).then(user => {
        if (user)
            return done(null, false, { message: 'Mail already used' });
        else {
            // Create user if email is free
            user = new User({
                username: profile._json.name ? profile._json.name : '',
                email: profile._json.email,
                firstname: profile._json.first_name ? profile._json.first_name : '',
                lastname: profile._json.last_name ? profile._json.last_name : '',
                img: profile.photo[0] ? profile.photo[0].value : '',
                oauthID: profile.id,
                facebook: profile._json ? profile._json : {}
            });
            // Sign token and connect user
            user
                .save()
                .then(user => res.cookies('token', genToken(user.email), { maxAge: 24 * 60 * 60 * 1000, domain:'localhost', secure: false, sameSite: true, httpOnly: false }))
                .catch(err => console.log(err))
                return done(null, user);
        }
    })
}
));
router.get('/facebook', passport.authenticate('facebook', { scope : [ 'email' ]}));

router.get('/facebook/callback', passport.authenticate('facebook', (res) => {
    return res.status(404).json({})
}));

// Github
// Connect to Github app id
passport.use(new GitHubStrategy({
    clientID: gitconfig.github.clientID,
    clientSecret: gitconfig.github.clientSecret,
    callbackURL: gitconfig.github.callbackURL,
    scope: [ 'user:email' ]
},
function(profile, done){
    // Check if github's email is already registered
    User.findOne({ oauthID: profile.email }).then(user => {
        if (user)
            return done(null, false, { message: 'Mail already used'});
        else {
            // Create user if email is free
            user = new User({
                username: profile._json.name ? profile._json.name : '',
                email: profile._json.email ? profile._json.email : '',
                firstname: '',
                lastname: '',
                img: profile._json.avatar_url ? profile._json.avatar_url : '',
                oauthID: profile.id,
                github: profile._json ? profile._json : ''
            });
            // Sign token and connect user
            user
                .save()
                .then(user => res.cookies('token', genToken(user.email), { maxAge: 24 * 60 * 60 * 1000, domain:'localhost', secure: false, sameSite: true, httpOnly: false}))
                .catch(err => console.log(err))
                return done(null, user);
        }
    })
}
));
router.get('/github', passport.authenticate('authenticate', { scope : 'user'}));

router.get('/github/callback', passport.authenticate('github', (res) => {
    return res.status(404).json({})
}));

// 42
// Connect to 42 app id
passport.use(new FortyTwoStrategy({
    authorizationURL : fortytwoconfig.quarantedeux.authorizationURL,
    tokenURL: fortytwoconfig.quarantedeux.tokenURL,
    clientID: fortytwoconfig.quarantedeux.clientID,
    clientSecret: fortytwoconfig.quarantedeux.clientSecret,
    callbackURL: fortytwoconfig.quarantedeux.callbackURL
},
function(profile, done) {
    // Check if 42 email is already registered on an account
    User.findOne({ oauthID: profile.email }).then(user => {
        if (user)
            return done(null, false, { message : 'Mail already used' });
        else {
            // Create user if email is free
            user = new User({
                username: profile.login ? profile.login : '',
                email: profile.email ? profile.email : '',
                firstname: profile.first_name ? profile.first_name : '',
                lastname: profile.last_name ? profile.last_name : '',
                img: profile.image_url ? profile.image_url : '',
                oauthID: profile.id,
                42: profile ? profile : {}
            });
            // Sign token and connect user
            user
                .save()
                .then(user => res.cookies('token', genToken(user.email), { maxAge: 24 * 60 * 60 * 1000, domain:'localhost', secure: false, sameSite: true, httpOnly: false }))
                .catch(err => console.log(err))
                return done(null, user)
        }
    })
}
));
router.get('/42', passport.authenticate('42'));

router.get('/42/callback', passport.authenticate('42', (res) => {
    return res.status(404).json({})
}))
// const facebookStrategy = require("passport-facebook");
const fbconfig = require("../../config/Oauthfacebook");
const User = require("../../models/User");
const keys = require("../../config/keys");
const genToken = require("../../utils/lib");
const passport = require('passport')
, facebookStrategy = require('passport-facebook').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const gitconfig = require("../../config/Oauthgithub");
const GitHubStrategy = require('passport-github').Strategy;
const express = require("express");
const fortytwoconfig = require('../../config/Oauth42');
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

passport.use( new facebookStrategy({
    clientID: fbconfig.facebook.clientID,
    clientSecret: fbconfig.facebook.clientSecret,
    callbackURL: fbconfig.facebook.callbackURL,
    profileFields: [ 'id', 'emails', 'name', 'picture.type(large)' ]
},

    function (accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, (err, data) => {
            if (err) { return done(err) }
            if (data) {
                return done(err, data);
            }
            else {
                var logUser = new User({
                    email: profile._json.email,
                    firstname: profile._json.first_name ? profile._json.first_name : '',
                    lastname: profile._json.last_name ? profile._json.last_name : '',
                    username: profile._json.first_name,
                    img: profile.photos[0].value ? profile.photos[0].value : '',
                    oauthID: profile.id,
                    active: 1,
                    facebook: profile._json ? profile._json : {}
                });
                logUser.save( (err) => {
                    if (err) { console.log(err) }
                    return done(err, logUser)
                })
            }
        })
    }
));

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login' }), (req, res) => {
    User.findOne({ oauthID: req.user.oauthID }).then(async(user) => {
        if (!user) { return res.status(400).json({}); }
        const payload = { id: user.id };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 },
            (err, token) => {
                if (!err) {
                    res.cookie('language', user.language, { maxAge: 2 * 60 * 60 * 1000, domain:'localhost'});
                    res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, domain:'localhost'});
                    return res.status(200).json({});
                }
                console.log(err)
                return res.status(400).json({});
            }
        )
    });
    res.redirect('http://localhost:3000/');
})


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
                email: profile._json.email ? profile._json.email : '',
                firstname: '',
                lastname: '',
                img: profile._json.avatar_url ? profile._json.avatar_url : '',
                oauthID: profile.id,
                github: profile._json ? profile._json : ''
            });
            user
                .save()
                .then(user => res.cookies('token', genToken(user.email), { maxAge: 24 * 60 * 60 * 1000, domain:'localhost', secure: false, sameSite: true, httpOnly: false}))
                .catch(err => console.log(err))
                return done(null, user);
        }
    })
}
));

module.exports = router;
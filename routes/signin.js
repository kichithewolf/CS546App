"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const twitter = data.twitter;

const  passport = require('passport');
const  Strategy = require('passport-facebook').Strategy;
const api = require('../data/facebook');
const secret = require("../lib/secret");
const fbMethods = data.fb;

fb(passport);

router.post("/tw", (req, res) => {
    twitter.getRequestToken().then((requestToken) => {
        res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    }).catch((err) => {
        let viewModel = { error: err.data };
        res.render("post/posts", viewModel);
    });
});

router.post('/fb', passport.authenticate('facebook', {
    successRedirect: '/post/posts',
    failureRedirect: '/'
}));

router.get('/fbposts', passport.authenticate('facebook', {failureRedirect: '/post'}),
    function (req, res) {
        //TODO: FB user needs to be in the session
        let viewModel = { facebookUser: req.user.displayName };
        res.render("post/posts", viewModel);
    });

module.exports = router;

function fb(passport) {
    passport.use(new Strategy({
            clientID: secret.facebook.clientID,
            clientSecret: secret.facebook.clientSecret,
            callbackURL: secret.facebook.callbackURL
        },
        function (accessToken, refreshToken, profile, cb) {
            fbMethods.setAccessToken(accessToken);
            return cb(null, profile);
        }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
}
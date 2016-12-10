"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const secret = require("../lib/secret");
const twitter = data.twitter;
const fbMethods = data.fb;

// Twitter authentication
router.post("/tw", (req, res) => {
    twitter.getRequestToken().then((requestToken) => {
        res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    }).catch((err) => {
        let viewModel = { error: err.data };
        res.render("post/posts", viewModel);
    });
});

router.get("/twitter", (req, res) => {
    var token = req.query.oauth_token,
        verifier = req.query.oauth_verifier;

    twitter.getAccessToken(token, verifier).then((accessToken) => {
        twitter.verifyCredentials(accessToken).then((user) => {
            req.session.twitterUser = user.name;
            res.redirect("/posts");
        }).catch((err) => {
            let viewModel = {error: err.data};
            res.render("post/posts", viewModel);
        });
    });
});


// Facebook authentication
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

router.post('/fb', passport.authenticate('facebook', {
    scope: ['publish_actions'],
    successRedirect: '/signin/fb',
    failureRedirect: '/'
}));

router.get('/fb', passport.authenticate('facebook', {scope: ['publish_actions'], failureRedirect: '/posts'}),
    function (req, res) {
        if (req.user.displayName !== undefined)
            req.session.facebookUser = req.user.displayName;
        res.redirect("/posts");
    });

module.exports = router;


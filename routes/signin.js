"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const twitter = data.twitter;

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
const api = require('../data/facebook');
const secret = require("../lib/secret");
const fbMethods = data.fb;

fb (passport);

router.get("/", (req, res) => {
    res.render("signin/index", {});
});

router.post("/tw", (req, res) => {
  twitter.getRequestToken().then((requestToken)=>{
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
  }).catch((err)=>{
     res.render("signin/index", {error: err.data});
  });
});

router.get("/twitter", (req, res) => {
     var token = req.query.oauth_token,
			verifier = req.query.oauth_verifier;

  twitter.getAccessToken(token, verifier).then((accessToken) =>{
            twitter.verifyCredentials(accessToken).then((user)=>{
                 res.redirect("/post");
            }).catch((err)=> {
             res.render("signin/index", {error: err.data});
        });
        });
});

  router.post('/fb', passport.authenticate('facebook', {
			successRedirect : '/fbposts',
			failureRedirect : '/'
		}));

    router.get('/fbposts', passport.authenticate('facebook', { failureRedirect: '/post' }),
    function(req, res){
      res.render("post/newpost", {});
    });

    router.post('/fbposts',
    function(req, res){
    let textElement = req.body.textElement;
    fbMethods.getAccessToken()
    .then((token)=>{
        api.postMessage(token, textElement, res)
        .then((result)=>{
            res.render("post/newpost", { result: result });
        })
    })
    });

module.exports = router;

function fb (passport)
{
    passport.use(new Strategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    callbackURL: secret.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    fbMethods.setAccessToken(accessToken).then(()=>{
    return cb(null, profile);
    });
    
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
}
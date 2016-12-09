"use strict"
var Strategy = require('passport-facebook').Strategy;
var secret = require("../lib/secret");
const data = require("../data");
const fbMethods = data.fb;
//const passportMethods = config.passport;
var GlobalaccessToken;

module.exports = function(passport) {
passport.use(new Strategy({
    clientID: secret.facebook.clientID,//'1795853277319454',
    clientSecret: secret.facebook.clientSecret,//'c74310f1dcafedcc1334ec471dfc6c7c',
    callbackURL: secret.facebook.callbackURL//'http://localhost:3000/fbsignin/fbposts'
  },
  function(accessToken, refreshToken, profile, cb) {
    //GlobalaccessToken = accessToken; 
    fbMethods.getAccessToken(accessToken)
    console.log("GlobalaccessToken: "+GlobalaccessToken);
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
}
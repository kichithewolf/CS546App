"use strict"
var twitterAPI = require('node-twitter-api'),
    secret = require("../lib/secret");

var twitter = new twitterAPI({
    consumerKey: secret.twitter.consumerKey,
    consumerSecret: secret.twitter.consumerSecret,
    callback: secret.twitter.callbackUrl
});

var requestToken;
var requestSecret;
var accessToken;
var accessSecret;
var oauth_verifier;

let exportedMethods = {
    getRequestToken() {
        return new Promise(function (resolve, reject) {
            twitter.getRequestToken(function (err, token, secret) {
                if (err)
                    reject(err);
                else {
                    requestToken = token;
                    requestSecret = secret;
                    resolve(token);
                }
            });
        });
    },

    getAccessToken(token, verifier) {
        let secret = requestSecret;
        oauth_verifier = verifier;

        return new Promise(function (resolve, reject) {
            twitter.getAccessToken(token, secret, verifier, function (err, token, secret) {
                if (err)
                    reject(err);
                else {
                    accessToken = token;
                    accessSecret = secret;
                    resolve(token);
                }
            });
        });
    },

    verifyCredentials(token) {
       // let accessSecret = accessSecret;
        return new Promise(function (resolve, reject) {
            twitter.verifyCredentials(token, accessSecret, function (err, user) {
                if (err) reject(err);
                else resolve(user);
            });
        });
    },

    textTweet(text) {
       // let accessSecret = accessSecret;
        return new Promise(function (resolve, reject) {
                twitter.statuses("update", {
                        status: text
                    },
                    accessToken,
                    accessSecret,
                    function(error, data, response) {
                        if (error) {
                            // something went wrong 
                            reject(error);
                        } else {
                            // data contains the data sent by twitter 
                            resolve(response);
                        }
                    }
                );
        });
    }


};

module.exports = exportedMethods;

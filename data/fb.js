"use strict"
//const passport = require('passport');
//const Strategy = require('passport-facebook').Strategy;
//const secret = require("../lib/secret");
const request = require('request');

let accessToken;

let exportedMethods = {
    setAccessToken(token) {
        accessToken = token;
    },

    getAccessToken() {
        return accessToken;
    },

    postMessage(process, message) {
        return new Promise((fulfill, reject) => {
            // this just means we're exiting quickly without posted to FB
            if (!process) {
                fulfill();
                return;
            }
            let url = 'https://graph.facebook.com/me/feed';
            let params = {
                access_token: accessToken,
                message: message
            };

            request.post({url: url, qs: params},
                function (err, resp, body) {
                    if (err)
                        reject(`Error occured: ${err}`);

                    body = JSON.parse(body);

                    if (body.error)
                        reject(`Error returned from facebook: ${body.error.message}`);

                    fulfill('The message has been posted to your Timeline');
                });
        });
    }
};

module.exports = exportedMethods;

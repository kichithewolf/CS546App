"use strict"
const twitterAPI = require('node-twitter-api'),
    secret = require("../lib/secret");
const fs = require('fs');

let twitter = new twitterAPI({
    consumerKey: secret.twitter.consumerKey,
    consumerSecret: secret.twitter.consumerSecret,
    callback: secret.twitter.callbackUrl
});

let requestToken;
let requestSecret;
let accessToken;
let accessSecret;
let oauth_verifier;

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

    textTweet(process, text) {
        // let accessSecret = accessSecret;
        return new Promise(function (resolve, reject) {
            // exit immediately without actually tweeting
            if (!process) {
                resolve();
                return;
            }
            twitter.statuses("update", {
                    status: text
                },
                accessToken,
                accessSecret,
                function (error, data, response) {
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
    },

    imageTweet(process, text, filePath) {
        // let accessSecret = accessSecret;
        return new Promise(function (resolve, reject) {
            // exit immediately without actually tweeting
            if (!process) {
                resolve();
                return;
            }

            fs.readFile(filePath, function (err, image) {
                twitter.uploadMedia({media: image},
                    accessToken,
                    accessSecret,
                    function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            // data contains the data sent by twitter
                            let mediaIdStr = data.media_id_string;

                            twitter.statuses("update", {
                                    status: text,
                                    media_ids: [mediaIdStr]
                                },
                                accessToken,
                                accessSecret,
                                function (error, data, response) {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        // data contains the data sent by twitter
                                        resolve(response);
                                        //console.log("success: image sent to twitter");
                                    }
                                }
                            );
                        }
                    });
            });
        });
    }


};

module.exports = exportedMethods;

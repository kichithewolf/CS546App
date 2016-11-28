"use strict"
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
const secret = require("../lib/secret");

var accessToken;

let exportedMethods = {
    setAccessToken(token) {
        return new Promise(function (resolve, reject) {
            if (token == null)
                reject(err);
            else {
                accessToken = token;
                resolve("Access token saved");
            }
        });
    },

    getAccessToken() {
        return new Promise(function (resolve, reject) {
            if (accessToken == null)
                reject(err);
            else 
                resolve(accessToken);
        });
    }
};

module.exports = exportedMethods;

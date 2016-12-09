"use strict"
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const secret = require("../lib/secret");

let accessToken;

let exportedMethods = {
    setAccessToken(token) {
        accessToken = token;
    },

    getAccessToken() {
        return accessToken;
    }
};

module.exports = exportedMethods;

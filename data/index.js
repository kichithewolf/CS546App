"use strict"
const postsData = require("./posts");
const usersData = require("./users");
const twitter = require("./twitter");
const fb = require("./fb");

module.exports = {
    posts: postsData,
    users: usersData,
    twitter: twitter,
    fb: fb
};
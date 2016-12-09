"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const api = require('../data/facebook');
const fbMethods = data.fb;

router.get("/", (req, res) => {
    let userId = req.session.userId;
    if (!userId) {
        res.redirect("/login");
        return;
    }
    let viewModel = {};
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        return postData.getAllPosts(userId);
    }).then((posts) => {
        console.log(posts);
        viewModel.posts = posts;
        res.render("post/posts", viewModel);
    }).catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.get("/:id", (req, res) => {
    let userId = req.session.userId;
    if (!userId) {
        res.redirect("/login");
        return;
    }
    let viewModel = {};
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        return postData.getPostById(userId, req.params.id);
    }).then((post) => {
        viewModel.post = post;
        res.render("post/single", viewModel);
    }).catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.post('/', (req, res) => {
    let accountsPosted = [];
    let postContent = req.body.postContent;
    let userId = req.session.userId;

    //TODO: this has to be changed to allow async post to twitter and fb and re-join after completing both to update page and database!!
    // also, addPost is async and success/error not handled yet
    if (req.body.facebook) {
        fbMethods.getAccessToken()
            .then((token) => {
                api.postMessage(token, postContent, res)
                    .then((msg) => {
                        accountsPosted.push({sent: Date.now(), accountType: "facebook", result: "success"});
                        postData.addPost(postContent, req.session.userId, accountsPosted);
                        res.render("post/posts", {result: msg});
                    }).catch((msg) => {
                        accountsPosted.push({sent: Date.now(), accountType: "facebook", result: "failed"});
                        postData.addPost(postContent, req.session.userId, accountsPosted)
                        res.render("post/posts", {error: msg});
                });
            })
    }
});

module.exports = router;

"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const api = require('../data/facebook');
const fbMethods = data.fb;
const twitter = data.twitter;

router.get("/", (req, res) => {
    let userId = req.session.collectiveUser;
    if (!userId) {
        res.redirect("/login");
        return;
    }
    let viewModel = {};
    if (req.session.twitterUser)
        viewModel.twitterUser = req.session.twitterUser;
    if (req.session.facebookUser)
        viewModel.facebookUser = req.session.facebookUser;
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        return postData.getAllPosts(userId);
    }).then((posts) => {
        viewModel.posts = posts;
        res.render("post/posts", viewModel);
    }).catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.post('/', (req, res) => {
    let accountsPosted = [];
    let postContent = req.body.postContent;
    let userId = req.session.collectiveUser;
    let viewModel = {username: userId};
    if (req.session.twitterUser)
        viewModel.twitterUser = req.session.twitterUser;
    if (req.session.facebookUser)
        viewModel.facebookUser = req.session.facebookUser;


    //TODO: this has to be changed to allow async post to twitter and fb and re-join after completing both to update page and database!!
    // also, addPost is async and success/error not handled yet
    let token = fbMethods.getAccessToken();
    api.postMessage(req.body.facebook, token, postContent, res)
        .then((msg) => {
            if (msg) {
                console.log("posted to FB");
                accountsPosted.push({sent: Date.now(), accountType: "facebook", result: "success"});
            }
        })
        .catch((msg) => {
            console.log("error posting to FB");
            accountsPosted.push({sent: Date.now(), accountType: "facebook", result: "failed"});
        })
        .then(() => {
            return twitter.textTweet(req.body.twitter, postContent);
        })
        .then((data) => {
            if (data) {
                console.log("tweeted");
                accountsPosted.push({sent: Date.now(), accountType: "twitter", result: "success"});
            }
        })
        .catch((err) => {
            console.log("error tweeting");
            accountsPosted.push({sent: Date.now(), accountType: "twitter", result: "failed"});
        })
        .then(() => {
            return postData.addPost(postContent, req.session.collectiveUser, accountsPosted);
        })
        .catch((err) => {
            console.log("error saving");
            return postData.getAllPosts(userId);
        })
        .then(() => {
            console.log("saved post");
            return postData.getAllPosts(userId);
        })
        .then((posts) => {
            console.log("retrieved posts, rendering");
            viewModel.posts = posts;
            res.render("post/posts", viewModel);
        }).catch((err) => {
            res.render("misc/debug", {error: err});
        });
});

router.get("/twitter", (req, res) => {
    var token = req.query.oauth_token,
        verifier = req.query.oauth_verifier;

    twitter.getAccessToken(token, verifier).then((accessToken) => {
        twitter.verifyCredentials(accessToken).then((user) => {
            let userId = req.session.collectiveUser;
            req.session.twitterUser = user.name;
            res.redirect("/posts");
        }).catch((err) => {
            let viewModel = {error: err.data};
            res.render("post/posts", viewModel);
        });
    });
});

router.get("/facebook", (req, res) => {
    if (req.user.displayName !== undefined)
        req.session.facebookUser = req.user.displayName;
    res.redirect("/posts");
});

router.get("/:id", (req, res) => {
    let userId = req.session.collectiveUser;
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


module.exports = router;

"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const facebook = data.fb;
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
        return postData.getMostRecentPosts(userId);
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

    facebook.postMessage(req.body.facebook, postContent)
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
        })
        .then(() => {
            console.log("saved post");
            return postData.getMostRecentPosts(userId);
        })
        .then((posts) => {
            console.log("retrieved posts, rendering");
            viewModel.posts = posts;
            res.render("post/posts", viewModel);
        }).catch((err) => {
            res.render("misc/debug", {error: err});
        });
});

router.get("/post/:id", (req, res) => {
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

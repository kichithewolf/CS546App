"use strict"
const fs = require('fs');
const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const facebook = data.fb;
const twitter = data.twitter;
const multer = require('multer')
const crypto= require('crypto');
const mime= require('mime');
const xss = require('xss');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
const upload = multer({ storage: storage });

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
        res.render("misc/debug", { error: err });
    });
});

router.post('/', upload.single('displayImage'), (req, res) => {
    let accountsPosted = [];
    let postContent = xss(req.body.postContent);
    let userId = req.session.collectiveUser;
    let viewModel = { username: userId };
    let imageObject;
    let filePath;
    let errFlag = 0;
    if(req.file)
    {
        imageObject = req.file;
        filePath = req.file.path;
    }

    if (req.session.twitterUser)
        viewModel.twitterUser = req.session.twitterUser;
    if (req.session.facebookUser)
        viewModel.facebookUser = req.session.facebookUser;

    if(imageObject && (imageObject.mimetype!=="image/jpeg" && imageObject.mimetype!=="image/png" && imageObject.mimetype!=="image/gif"))
    {
        res.render("post/posts", {error: "Please upload only JPEG, PNG and GIF images!"});
        return;
    }

    facebook.postMessage(req.body.facebook, postContent, filePath)
        .then((msg) => {
            if (msg) {
                console.log("posted to FB");
                accountsPosted.push({ sent: Date.now(), accountType: "facebook", result: "success" });
            }
        })
        .catch((msg) => {
            viewModel.error = msg;
            console.log("error posting to FB");
            errFlag = 1;
        })
        .then(() => {
            if (!filePath)
                return twitter.textTweet(req.body.twitter, postContent);
            else
                return twitter.imageTweet(req.body.twitter, postContent, filePath);
        })
        .then((data) => {
            if (data) {
                console.log("tweeted");
                accountsPosted.push({ sent: Date.now(), accountType: "twitter", result: "success" });
            }
        })
        .catch((err) => {
            viewModel.error = JSON.parse(err.data).errors[0].message;
            console.log("error tweeting");
            errFlag = 1;
        })
        .then(() => {
            if(!errFlag){
            console.log("saved post");
            return postData.addPost(postContent, filePath, req.session.collectiveUser, accountsPosted);
            }
            else
            return;
        })
        .catch((err) => {
            console.log("error saving", err);
        })
        .then(() => {
            return postData.getMostRecentPosts(userId);
        })
        .then((posts) => {
            console.log("retrieved posts, rendering");
            viewModel.posts = posts;
            res.render("post/posts", viewModel);
        }).catch((err) => {
            res.render("misc/debug", { error: err });
        });
});

router.get("/post/:id", (req, res) => {
    let userId = req.session.collectiveUser;
    if (!userId) {
        res.redirect("/login");
        return;
    }
    userData.getUserByName(userId).then((user) => {
        return postData.getPostById(userId, req.params.id);
    }).then((post) => {
        res.render("post/single", post);
    }).catch((err) => {
        res.render("misc/debug", { error: err });
    });
});

router.get("/image/:name", (req, res) => {
    let userId = req.session.collectiveUser;
    if (!userId) {
        res.redirect("/login");
        return;
    }
    return res.sendFile(req.params.name, { root: __dirname + '/../uploads/'} ,function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});

module.exports = router;

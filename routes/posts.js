const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/", (req, res) => {
    //TODO: get userid from session store based on sessionId in request
    let user = 1; // dummy for now
    postData.getAllPosts(user)
        .then((posts) => {
            // note that posts might be empty...
            res.render("post/post", posts);
        })
        .catch((err) => {
            res.render("misc/debug", {error: err});
        });
});

router.get("/:id", (req, res) => {
    //TODO: get the userId from session
    let user = 1; // dummy for now
    postData.getPost(userId, id)
        .then((post) => {
            // note that posts might be empty...
            res.render("post/single", post);
        })
        .catch((err) => {
            res.render("misc/debug", {error: err});
        });
});

module.exports = router;

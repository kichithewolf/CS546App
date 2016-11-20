const express = require('express');
const router = express.Router();
const data = require("../data");
const twitter = data.twitter;

router.get("/", (req, res) => {
    res.render("post/newpost", {});
});

router.post("/", (req, res) => {
    let textElement = req.body.textElement;
    twitter.textTweet(textElement).then((data) => {
        res.render("post/newpost", { result: data.statusMessage });
    }).catch((err) => {
        res.render("post/newpost", { error: err.data });
    });
});

module.exports = router;
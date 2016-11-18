const express = require('express');
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;

router.get("/", (req, res) => {
    let userId = req.session.userId;
    if (!userId ){
        res.redirect("/login");
        return;
    }
    let viewModel = { };
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        postData.getAllPosts(userId);
    }).then((posts) => {
        viewModel.posts = posts;
        res.render("post/posts", viewModel);
    })
    .catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.get("/configure", (req, res) => {
    let userId = req.session.userId;
    if (!userId ){
        res.redirect("/login");
        return;
    }
    let viewModel = { };
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        res.render("post/configure", viewModel);
    })
    .catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.get("/:id", (req, res) => {
    let userId = req.session.userId;
    if (!userId ){
        res.redirect("/login");
        return;
    }
    let viewModel = { };
    userData.getUserByName(userId).then((user) => {
        viewModel.username = user.username;
        viewModel.accounts = user.accounts;
        postData.getPostById(userId, req.params.id);
    }).then((post) => {
        viewModel.post = post;
        res.render("post/single", viewModel);
    })
    .catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

router.post("/configure", (req, res) => {
    let userId = req.session.userId;
    if (!userId ){
        res.redirect("/login");w
        return;
    }
    userData.updateUserAccounts(userId, req.body.accounts).then(() => {
        res.redirect("/posts");
    })
    .catch((err) => {
        res.render("misc/debug", {error: err});
    });
});

module.exports = router;

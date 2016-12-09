"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

router.get("/", (req, res) => {
    res.render("login/login", {});
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render("login/login", { username: username, password: password, error: 'Invalid user name or password' });
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            req.session.collectiveUser = user.username;
            return res.redirect("/posts");
        });
    })(req, res, next);
});

router.get("/register", (req, res) => {
    res.render("login/register", {});
});


router.post("/register", (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    
    usersData.addUser(username, email, password).then((result) => {
        if (result === true) {
            res.redirect("/login");
        }
    }).catch((e) => {
        res.render("login/register", { username: username, email: email, password: password, error: e });
    });
});

// To check if the users are actually being added, just for debugging phase. To be removed later
router.get("/getallusers", (req, res) => {
    usersData.getAllUsers().then((usersCollection) => {
        res.send(usersCollection);
    });
});

// Just for debugging purpose. To be removed later.
router.get("/removeallusers", (req, res) => {
    usersData.removeAllUsers().then(() => {
        res.send("ok");
    });
});

module.exports = router;

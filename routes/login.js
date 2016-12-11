"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const xss = require('xss');

router.get("/", (req, res) => {
    res.render("login/login", {});
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render("login/login", { username: req.body.username, password: req.body.password, error: 'Invalid user name or password' });
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
    let username = xss(req.body.username);
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    
    usersData.addUser(username, email, password).then((result) => {
        if (result === true) {
            res.redirect("/login");
        }
    }).catch((e) => {
        res.render("login/register", { username: username, email: email, password: password, error: e });
    });
});

module.exports = router;

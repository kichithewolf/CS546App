"use strict"
const loginRoutes = require("./login");
const postRoutes = require("./posts");
const signIn = require("./signin");

const constructorMethod = (app) => {
    app.use("/login", loginRoutes);     // login and register for app
    app.use("/posts", postRoutes);      // dislpay posts, make a post, main page
    app.use("/signin", signIn);         // sign in to facebook/twitter (no views)

    app.use("*", (req, res) => {
        console.error("Request for undefiuned route ", req);
        res.sendStatus(404);
        //TODO: send "about Collective" page with link to login and register
    })
};

module.exports = constructorMethod;

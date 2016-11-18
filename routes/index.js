const loginRoutes = require("./login");
const postRoutes = require("./posts");

const constructorMethod = (app) => {
    app.use("/login", loginRoutes);
    app.use("/posts", postRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
        //TODO: send "about Collective" page with link to login and register
    })
};

module.exports = constructorMethod;

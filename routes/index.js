const loginRoutes = require("./login");

const constructorMethod = (app) => {
    app.use("/login", loginRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;

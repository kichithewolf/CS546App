const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const expressSession = require('express-session');
const bcrypt = require("bcryptjs");
const data = require("./data");
const usersData = data.users;
const configRoutes = require("./routes");
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));
app.use("/public", express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({secret: 'Social Media for Dogs!'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal( { },
    function(username, password, done) {
        usersData.getUserByName(username).then((user) => {
            if (!user) {
                return done(null, false, {message: 'Unknown username.'});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        }).catch(() => {
            return done(null, false, {message: 'Error retrieving user.'});
        });
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user.username);
});

passport.deserializeUser(function(id, cb) {
    usersData.getUserByName(id).then((user) => {
        if (!user)
            return cb("User not found");
        cb(null, user);
    }).catch(() => {
        return cb("User not found");
    });
});

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
        
            return new Handlebars.SafeString(JSON.stringify(obj));
        },
        prettyDate: (ms) => {
            let d = new Date(ms);
            return d.toLocaleString();
        }
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000/login");
});
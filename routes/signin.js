const express = require('express');
const router = express.Router();
const data = require("../data");
const twitter = data.twitter;

router.get("/", (req, res) => {
    res.render("signin/index", {});
});

router.post("/", (req, res) => {
  twitter.getRequestToken().then((requestToken)=>{
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
  }).catch((err)=>{
     res.render("signin/index", {error: err.data});
  });
});

router.get("/twitter", (req, res) => {
     var token = req.query.oauth_token,
			verifier = req.query.oauth_verifier;

  twitter.getAccessToken(token, verifier).then((accessToken) =>{
            twitter.verifyCredentials(accessToken).then((user)=>{
                 res.redirect("/post");
            }).catch((err)=> {
             res.render("signin/index", {error: err.data});
        });
        });
});

module.exports = router;
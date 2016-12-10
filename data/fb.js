"use strict"
//const passport = require('passport');
//const Strategy = require('passport-facebook').Strategy;
//const secret = require("../lib/secret");
const request = require('request');
var https = require('https'); //Https module of Node.js
var fs = require('fs'); //FileSystem module of Node.js
var FormData = require('form-data'); //Pretty multipart form maker.

let accessToken;

let exportedMethods = {
    setAccessToken(token) {
        accessToken = token;
    },

    getAccessToken() {
        return accessToken;
    },

    postMessage(process, message, imagePath) {
        return new Promise((fulfill, reject) => {
            // this just means we're exiting quickly without posted to FB
            if (!process) {
                fulfill();
                return;
            }

            if(imagePath ==  null || imagePath == undefined)
            {
                let url = 'https://graph.facebook.com/me/feed';
                let params = {
                    access_token: accessToken,
                    message: message
                };

                request.post({url: url, qs: params},
                    function (err, resp, body) {
                        if (err)
                            reject(`Error occured: ${err}`);

                        body = JSON.parse(body);

                        if (body.error)
                            reject(`Error returned from facebook: ${body.error.message}`);

                        fulfill('The message has been posted to your Timeline');
                    });
            }//if not photo   

            else
            {
                var form = new FormData(); 
                form.append('file', fs.createReadStream(imagePath));
                form.append('message', message); 
                
                var options = {
                    method: 'post',
                    host: 'graph.facebook.com',
                    path: '/me/photos?access_token='+accessToken,
                    headers: form.getHeaders(),
                }
                
                var req = https.request(options, function (res){
                    console.log(res);
                });
                
                form.pipe(req);
                
                req.on('error', function (error) {
                    console.log(error);
                    reject(error);
                });

                var msg = 'The message has been posted to your Timeline';
                fulfill(msg);
            }

        }).catch(err => 
        console.log("***************>>>>>>>>> err: "+err) 
        );
    }
};

module.exports = exportedMethods;

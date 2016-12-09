"use strict"
const  request = require('request');

function postMessage(process, access_token, message) {
    return new Promise((fulfill, reject) => {
        // this just means we're exiting quickly without posted to FB
        if (!process) {
            fulfill();
            return;
        }
        var url = 'https://graph.facebook.com/me/feed';
        var params = {
            access_token: access_token,
            message: message
        };

        request.post({url: url, qs: params},
            function (err, resp, body) {
                if (err)
                    reject(`Error occured: ${err}`);

                body = JSON.parse(body);

                if (body.error)
                    reject(`Error returned from facebook: ${body.error.message}`);

                var msg = 'The message has been posted to your Timeline';
                fulfill(msg);
            });
    });
}

exports.postMessage = postMessage;
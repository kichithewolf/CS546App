"use strict"
var request = require('request');

function postMessage(access_token, message) {
    return new Promise((fulfill, reject) => {
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
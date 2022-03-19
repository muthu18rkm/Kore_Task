const express = require('express');
const bodyParse = require('body-parser');
const request = require('request');
const path = require('path');
const config = require('./config');
const app = express();
const captcha = require("nodejs-captcha");

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(express.static(__dirname + '/public'));

//HTML Link
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
    console.log("App is connected");
});

//listening port
app.listen(config.apport.port, () => {
    console.log("App is running on port " + config.apport.port);
    getGroupUrl();
});

//Generate Group Token
function getGroupUrl() {
    request({
        url: config.bitly.groupurl,
        method: config.bitly.groupmethod,
        headers: {
            "Authorization": "Bearer " + config.bitly.token
        }
    }, function (err, response, body) {
        let parsedata = JSON.parse(body)
        // console.log(parsedata);
        config.bitly.groupid = parsedata.groups[0].guid;
    });
};

//Generate Shorten URL
app.post("/shortenurl/createshortenurl/", (req, res) => {
    if (req.body.longurl.startsWith("https://") || req.body.longurl.startsWith("http://")) {
        let constructdata = {
            "long_url": req.body.longurl,
            "domain": config.bitly.domain,
            "group_guid": config.bitly.groupid
        }
        request({
            url: config.bitly.shortenurl,
            method: config.bitly.shortenmethod,
            headers: {
                "Authorization": "Bearer " + config.bitly.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(constructdata)
        }, function (err, response, body) {
            // console.log(JSON.stringify(body));
            res.status(200).send(body);
        });
    } else {
        res.status(400).send("Invalid Long URL");
    }
});

//Generate Capatcha
app.get("/captcha/createcaptch/", (req, res) => {
    // let captchavalues = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    // let values = [];
    // let length = 10;
    // for (let i = 0; i < length; i++) {
    //     let j = (Math.random() * (captchavalues.length - 1)).toFixed(0);
    //     values[i] = captchavalues[j];
    // }

    //Default Node Captcha
    let result = captcha({ length: 8 });
    res.status(200).send(result);
});




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

    //This method Image render in not working
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

//Get Paging 

app.get('/paginate/getpaginatevalue/', (req, res) => {

    const users = [
        { "_id": 1, "Name": "User 1" },
        { "_id": 2, "Name": "User 2" },
        { "_id": 3, "Name": "User 3" },
        { "_id": 4, "Name": "User 4" },
        { "_id": 5, "Name": "User 5" },
        { "_id": 6, "Name": "User 6" },
        { "_id": 7, "Name": "User 7" },
        { "_id": 8, "Name": "User 8" },
        { "_id": 9, "Name": "User 9" },
        { "_id": 10, "Name": "User 10" },
        { "_id": 11, "Name": "User 11" },
        { "_id": 12, "Name": "User 12" },
        { "_id": 13, "Name": "User 13" },
    ]

    let page = parseInt(req.query.page);
    let limit = users.length;
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    let startindex = (page - 1) * limit;
    let endindex = page * limit;

    let result = users.slice(startindex, endindex);
    res.status(200).send(JSON.stringify(result))

});



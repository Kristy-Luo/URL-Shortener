var express = require('express');
var router = express.Router(); 
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');

// respond to a HTTP POST request to /api/v1/urls
router.post('/urls', jsonParser, function (req, res) {
    var longUrl = req.body.longUrl; 
    urlService.getShortUrl(longUrl, function (url) {
        res.json(url); 
    });
});

// handle the request sending from front-end to get the original URL of a short URL
router.get("/urls/:shortUrl", function (req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function (url) {
        // respond with url mapping 
        res.json(url); 
    });
});

// handle the request sending from front-end asking for statistics data
router.get("/urls/:shortUrl/:info", function (req, res) {
    statsService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
        res.json(data);
    });
});
module.exports = router; 
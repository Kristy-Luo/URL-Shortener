var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');
var path = require('path');

// define a route responding to a HTTP GET request to /:shortUrl
router.get("*", function (req, res) {
    var shortUrl = req.originalUrl.slice(1);
    urlService.getLongUrl(shortUrl, function (url) {
        if (url) {
            console.log(url);
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
        }else {
            res.sendFile("404.html", {root: path.join(__dirname, '../public/views/')});
        }
    });
});

module.exports = router; 
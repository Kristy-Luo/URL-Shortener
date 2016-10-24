var UrlModel = require("../models/urlModel");

var redis = require("redis");
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var redisClient = redis.createClient(port, host);


// insert operation
var getShortUrl = function (longUrl, callback) {
    if (longUrl.indexOf("http") === -1) {
        longUrl = "http://" + longUrl;
    }
    redisClient.get(longUrl, function (err, shortUrl) {
        if (shortUrl) {
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        }else {
            UrlModel.findOne({longUrl: longUrl}, function (err, data) {
                if (data) {
                    callback(data);
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                } else {
                    generateShortUrl(function (shortUrl) {
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl
                        });
                        url.save();
                        callback(url);
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                    });
                }
            });
        }
    });
};

var generateShortUrl = function (callback) {
    UrlModel.count({}, function (err, count) {
        callback(convertTo62(count));
    });
};

var convertTo62 = function (id) {
    var encode = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var shortUrl = "";
    do {
        shortUrl = encode.charAt(id % 62) + shortUrl;
        id = Math.floor(id / 62);
    } while (id);

    while (shortUrl.length < 6) {
        shortUrl = "0" + shortUrl;
    }
    return shortUrl;
}

var getLongUrl = function (shortUrl, callback) {

    redisClient.get(shortUrl, function (err, longUrl) {
        if (longUrl) {
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            UrlModel.findOne({ shortUrl: shortUrl }, function (err, data) {
                callback(data);
                if (data) {
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                }
            });
        }
    });
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};
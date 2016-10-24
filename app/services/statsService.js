var geoip = require('geoip-lite');
var requestModel = require("../models/requestModel");

var logRequest = function (shortUrl, req) {
    var reqInfo = {};

    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || "Unknown";
    reqInfo.platform = req.useragent.platform || "Unknown";
    reqInfo.browser = req.useragent.browser || "Unknown";

    var ip = req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    }else {
        reqInfo.country = "Unknown";
    }
    reqInfo.timestamp = new Date();

    var request = new requestModel({
        shortUrl: reqInfo.shortUrl,
        referer: reqInfo.referer,
        platform: reqInfo.platform,
        browser: reqInfo.browser,
        country: reqInfo.country,
        timestamp: reqInfo.timestamp
    });
    request.save();
};

var getUrlInfo = function (shortUrl, info, callback) {
    if (info === "totalClicks") {
        // counts the number of documents containing the matching shortUrl
        requestModel.count({shortUrl: shortUrl}, function (err, count) {
            callback(count);
        });
        return;
    }

    var groupId = "";

    if (info === "hour") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"},
            minutes: { $minute: "$timestamp"}
        }
    } else if (info === "day") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"}
        }
    } else if (info === "month") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"}
        }
    } else {
        groupId = "$" + info;
    }

    requestModel.aggregate([
        {
            $match: {
                shortUrl: shortUrl
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $group: {
                _id: groupId,
                count: {$sum: 1}
            }
        }
    ], function (err, data) {
        callback(data);
    });
};

module.exports = {
    logRequest: logRequest,
    getUrlInfo: getUrlInfo
};
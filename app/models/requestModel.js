var mongoose = require("mongoose");

var requestSchema = mongoose.Schema({
    shortUrl: String,
    referer: String,
    platform: String,
    browser: String,
    country: String,
    timestamp: Date
});

var requestModel = mongoose.model('requestModel', requestSchema);

module.exports = requestModel;

var mongoose = require("mongoose"); 
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    longUrl: String, 
    shortUrl: String
});

var urlModel = mongoose.model('urlModel', urlSchema);

module.exports = urlModel; 
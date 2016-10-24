var express = require('express');
var app = express(); 

var indexRouter = require('./routes/index');
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');

var mongoose = require('mongoose');
mongoose.connect("mongodb://user:user@ds049476.mlab.com:49476/tinyurl");

var useragent = require('express-useragent');

app.use("/public", express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(useragent.express());
app.use("/api/v1", restRouter);
app.use("/", indexRouter);
app.use("/:shortUrl", redirectRouter);

app.listen(3000);


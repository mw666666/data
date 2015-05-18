var express = require('express');
var path = require('path');
var ejs = require('ejs');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var Cookies = require('cookies');
var app = express();

app.set('views', global.config.viewsPath);
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(cookieSession({
//     secret: '123456'
// }));

// app.use(session({
//   genid: function(req) {
//     return genuuid() // use UUIDs for session IDs
//   },
//   secret: 'keyboard cat'
// }))

app.use(session({
    secret: 'qmw920@163.com123456',
    resave: false,
    saveUninitialized: true
}))

app.use(function(req, res, next) {
    req.session.user = req.session.user || {};
    next()
})

//app.get('/foo', function (req, res, next) {
//  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
//})
//
//app.get('/bar', function (req, res, next) {
//  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
//})

// app.use(express.methodOverride());


app.use(express.static(global.config.staticPath));


// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

module.exports = app;
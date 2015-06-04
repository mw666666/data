#!/usr/bin/env node
var debug = require('debug')('myapp');
global.rootPath = __dirname + '/';
var app = require('./app');

// app.set('port', process.env.PORT || 80);
// app.listen(app.get('port'), function() {
//   debug('Express server listening on port ' + server.address().port);
// });
app.listen();
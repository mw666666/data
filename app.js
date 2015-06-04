var express = require('express');
global.rootPath = __dirname + '/';
var config = require('./config/config');
var utils = require('./system/utils/utils');
global.config = config;
global.q = {
    utils: utils
};

var app = require('./system/expressInit');
var controller = require('./system/controller');

controller.init(app);
var num = 0;
//app.all('*', function(req, res, next){
//    console.log(++num)
//});

//express.Router().get('/api/*', function(req, res, next){
//  console.log('3333333333333333')
//});

global.output = function(data, flag){
  var outputData = {
    flag: 1,
    data: data
  };

  if(typeof flag != 'undefined'){
    outputData.flag = 1;
  }

  return outputData;
}

module.exports = app;

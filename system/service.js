var servicesPath = global.config.servicesPath;
var servicesDir = global.config.servicesDir;
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var glob = require("glob");

function Class(constructorMethods, db){
    var Constructor = null;
    var instance = null;

    Constructor = function(){
        this.db = db;
    };

    _.extend(Constructor.prototype, constructorMethods);
    instance = new Constructor();

    return instance;
}

module.exports = function(db, serviceName){
    var serviceMethods = require(path.join(servicesDir + serviceName));
    var service = Class(serviceMethods, db);
    return service;
};
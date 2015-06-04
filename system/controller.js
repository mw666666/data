var fs = require('fs');
var path = require('path');
var express = require('express');
var _ = require('lodash');
var glob = require("glob");
var database = require('./database');
var service = require('./service');
var db = database.create();
var config = global.config;
var controllersPath = config.controllersPath;
var controllersDir = config.controllersDir;
var filtersPath = config.filtersPath;
var filtersDir = config.filtersDir;
var filterFuns = {};

function init(app){
	
	var controllerFiles = glob.sync(controllersDir + '**/*.js');
	var filterFiles = glob.sync(filtersDir + '**/*.js');
    var filterName = '';

	_.forEach(filterFiles, function(file, index){
        var filterName = path.basename(file, '.js');
		filterFuns[filterName] = require(filtersDir + filterName);
	});

	_.forEach(controllerFiles, function(file){
		// var stat = fs.statSync(controllersPath + file);
		var stat = fs.statSync(file);
		var filePath = path.relative(path.dirname(), file).replace('\\', '/');
		var controllerPath = path.dirname(filePath) + '/';
		var controllerName = path.basename(file, '.js');
		var routerUrl = '';
		var Controller = '';
		var controller = '';

		if(stat.isFile()){
			controllerPath = controllerPath.replace(controllersPath, '/');
			routerUrl = controllerPath + controllerName;
			Controller = require(file);
			var controller = controllerInstantiate(Controller, routerUrl, app);
//			console.log('userouterUrl:' + routerUrl)
			// app.use(routerUrl, controller);
		}
	});

}

function controllerInstantiate(constructorMethods, routerUrl, app){
	var instance = new Class(constructorMethods, routerUrl);
	var actions = instance.actions;
	
	var httpReqMethod = global.config.httpReqMethod || ['get', 'post', 'delete', 'put'];

	// console.log('use router:' + routerUrl);

	_.forOwn(actions, function(action, routerStr){
		var commonAction = null;
		var router = express.Router();
		if(_.isFunction(action)){
			commonAction = action;
			action = {};

			httpReqMethod.forEach(function(method){
				action[method] = function(){
					commonAction.apply(this, arguments);
				}
			});
		}

		_.forEach(action, function(actionFun, method){
			(function(routerStr, action, method, instance){
				// console.log('router:', method, '/' + routerStr)
				router[method]('/' + routerStr, getRouters(routerUrl + '/' + routerStr, method, function(req, res, next){
					actionFun.apply(instance, [req, res, next]);
				}));
			})(routerStr, action, method, instance);
		});

		app.use(routerUrl, router);
	});

}

function Class(constructorMethods, routerUrl){
	var Controller = null;
	var ctrl = null;

	if(_.isFunction(constructorMethods)){//兼容controller是个函数
		var F = function(){
			this.db = db;
			this.service = ser;
		}
		Controller = constructorMethods;

		_.extend(F.prototype, Controller.prototype);

		ctrl = new F();
		Controller.call(ctrl);
		ctrl.actions && _.extend(F.prototype, ctrl.actions);
	}else if(_.isObject(constructorMethods)){
		Controller = function(){
			this.db = db;
			this.service = ser;
            // this.service();
			this.actions = constructorMethods;
		};
		_.extend(Controller.prototype, constructorMethods);
		ctrl = new Controller();
	}

	if(!ctrl.actions['']){
		ctrl.actions[''] = ctrl.index || function(req, res, next){
			res.sendData({errorMsg: '非法接口'}, false);
		}
	}

	function ser(serviceName){
		serviceName = serviceName || routerUrl;
		return service(db, serviceName);		
	}
	// Controller.call(this);

	return ctrl;
}

function getRouters(routerStr, method, router){
	var routers = [];
	var reg = null;
	var filter = null;
	var key = '';
	var filters = config.filters;
	var filterNames = [];
	_.forEach(filters, function(filterNames, key){

		if(_.isPlainObject(filterNames)){
			filterNames = filterNames[method] || [];
		}

		if(_.isString(filterNames)){
			filterNames = [filterNames];
		}				

		_.forEach(filterNames, function(filterName) {
			filter = filterFuns[filterName];
			reg = new RegExp(key);
			if (reg.test(routerStr)) {
				if (_.isFunction(filter)) {
					routers.push(filter);
				} else if (_.isPlainObject(filter)) {
					if (method in filter) {
						routers.push(filter);
					}
				}
			}
		});		
	});

	routers.push(router);
	return routers;
}


module.exports = {
	init: function(app){
		init(app);
	},
};

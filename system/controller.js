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
var filtersPath = config.filtersPath;
var filterFuns = {};

//// var router = express.Router();

function init(app){
	// var controllerFiles = fs.readdirSync(controllersPath);
	// var filterFiles = fs.readdirSync(filtersPath);
	// ‌‌glob(controllersPath + '**/*.js', function(e, files){
	// 	console.log(files[0])
	// });
	// return ;
	var controllerFiles = glob.sync(controllersPath + '**/*.js');
	var filterFiles = glob.sync(filtersPath + '**/*.js');
    var filterName = '';

	_.forEach(filterFiles, function(file, index){
        var filterName = path.basename(file, '.js');
		filterFuns[filterName] = require(filtersPath + filterName);
	});

	_.forEach(controllerFiles, function(file){
		// var stat = fs.statSync(controllersPath + file);
		var stat = fs.statSync(file);
		var controllerDir = path.dirname(file) + '/';
		var controllerName = path.basename(file, '.js');
		var routerUrl = '';
		var Controller = '';
		var controller = '';

		if(stat.isFile()){
			controllerDir = controllerDir.replace(controllersPath, '/');
			routerUrl = controllerDir + controllerName;
			Controller = require(file);
			var controller = controllerInstantiate(Controller, routerUrl, app);
//			console.log('userouterUrl:' + routerUrl)
			// app.use(routerUrl, controller);
		}
	});
    // app.use('/qqq', function(req, res, next){
    //     console.log('3333333：' + req.originalUrl);
    //     res.sendData({test: 'test SDemo'});
    // });
    // app.use('/*', function(req, res, next){
    //     console.log('其它一切请求(/*), 请求地址：' + req.originalUrl);
    // });
}

function controllerInstantiate(constructorMethods, routerUrl, app){
	var instance = new Class(constructorMethods, routerUrl);
	var actions = instance.actions;
	
	var httpReqMethod = global.config.httpReqMethod || ['get', 'post', 'delete', 'put'];

	console.log('use router:' + routerUrl);

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
				console.log('router:', method, '/' + routerStr)
				router[method]('/' + routerStr, getRouters(routerUrl + '/' + routerStr, method, function(req, res, next){
					actionFun.apply(instance, [req, res, next]);
				}));
			})(routerStr, action, method, instance);
		});

		app.use(routerUrl, router);
	});

	// router.get('/qqq*', function(req, res, next){
	//   console.log('3333333333333333')
	//   res.sendData({test: 'test SDemo'});
	// });	

	// router.get('/*', function(req, res, next){
	//   console.log('3333333333333333')
	// });
 //    router.post('/*', function(req, res, next){
 //        console.log('3333333333333333')
 //    });
	// return router;
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

var modelsPath = global.config.modelsPath;
var modelsDir = global.config.modelsDir;
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var dbName = global.config.db.database;
var username = global.config.db.username;
var password = global.config.db.password;
var port = global.config.db.port;
var host = global.config.db.host;
var db = {};
// var username = 'root';//用户AK
// var password = 'root';//用户SK
// var host = '127.0.0.1';
// var port = 3306;
// var dbName = 'sdemo';
// console.log('config:'+ JSON.stringify(global.config));

function init() {
    var models = fs.readdirSync(modelsDir);

    models.forEach(function(file) {
        var stat = fs.statSync(modelsDir + file);
        var fileName = path.basename(file, '.js');

        if (stat.isFile()) {
            // var model = sequelize.import(path.join(modelsDir, file));
            // db[model.name] = model;
            db[fileName] = path.join(modelsDir, fileName);
        }
    });

    dbGetSet();

    // Object.keys(db).forEach(function(modelName) {
    //     if ('associate' in db[modelName]) {
    //         db[modelName].associate(db)
    //     }
    // })
}

function dbGetSet(that){
    _.forEach(that.db, function(path, name){
        var model = null;
        Object.defineProperty(that, name, {
            get: function() {
                model = that.sequelize.import(path);
                // model.sync();
                return model; 
            },
            set: function() {
                model = that.sequelize.import(path);
                model.sync();
            },
            enumerable: true,
            configurable: true
        });
    });
}


// db.sequelize.sync().success(function() {    
// });


function DataBase(){
    this.sequelize = new Sequelize(dbName, username, password, {
        host: host,
        port: port
    });
    this.Sequelize = Sequelize;
    this.db = {};
    this.init();
}

DataBase.prototype = {
    constructor: DataBase,
    init: function(){
        var that = this;
        var models = fs.readdirSync(modelsDir);

        models.forEach(function(file) {
            var stat = fs.statSync(modelsDir + file);
            var fileName = path.basename(file, '.js');

            if (stat.isFile()) {
                // var model = sequelize.import(path.join(modelsDir, file));
                // db[model.name] = model;
                that.db[fileName] = path.join(modelsDir, fileName);
            }
        });

        dbGetSet(this);    
    }
}

DataBase.create = function(){
    var db = new DataBase();
    // db.init();

    return db;
}

module.exports = DataBase;
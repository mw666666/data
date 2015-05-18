var modelsPath = global.config.modelsPath;
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var dbName = global.config.db.database;
var username = global.config.db.username;
var password = global.config.db.password;
var sequelize = new Sequelize(dbName, username, password);
var db = {};

function init() {
    var models = fs.readdirSync(modelsPath);

    models.forEach(function(file) {
        var stat = fs.statSync(modelsPath + file);
        var fileName = path.basename(file, '.js');

        if (stat.isFile()) {
            // var model = sequelize.import(path.join(modelsPath, file));
            // db[model.name] = model;
            db[fileName] = path.join(modelsPath, fileName);
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
                model = model || sequelize.import(path);
                model.sync();
                return model; 
            },
            set: function() {
                model = sequelize.import(path);
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
    this.sequelize = new Sequelize(dbName, username, password);
    this.Sequelize = Sequelize;
    this.db = {};
    this.init();
}

DataBase.prototype = {
    constructor: DataBase,
    init: function(){
        var that = this;
        var models = fs.readdirSync(modelsPath);

        models.forEach(function(file) {
            var stat = fs.statSync(modelsPath + file);
            var fileName = path.basename(file, '.js');

            if (stat.isFile()) {
                // var model = sequelize.import(path.join(modelsPath, file));
                // db[model.name] = model;
                that.db[fileName] = path.join(modelsPath, fileName);
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
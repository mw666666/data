var path = require('path');
var config = {
    port: 8080,
    basePath: path.relative(path.dirname(), global.rootPath), //应用根路径，程序中常用
    baseDir: global.rootPath, //应用根路径，程序中常用
    script_ext: ".js", //编程用的脚本后缀
    assets_head: "/assets",
    session_secret: "111111", //session
    paths: {
        controllersPath: 'controllers/',
        modelsPath: 'models/',
        filtersPath: 'filters/',
        servicesPath: 'services/',
        viewsPath: 'views/',
        staticPath: 'angular/',
    },
    db: {
        host: "127.0.0.1", //数据库地址
        database: "sdemo", //数据库名
        username: "sdemo", //数据库用户名
        password: "123456", //数据库密码
        port: 3306
    },
    filters: {
        '.*': ['reqres'],
        '/sdemo/DemoCode/save': ['checkLogin'],
        '/sdemo/DemoCode/download': ['checkLogin'],
    },
    httpReqMethod: ['get', 'post'],  //'delete', 'put'
    errorCodes: {
        //http错误码
        serverError: {
            code: 500,
            msg: '服务器错误',
            // flag: 1  //默认是0
        },
        notExist: {
            code: 404,
            msg: '不存在',
        },
        forbidden: {
            code: 403,
            msg: '禁止访问',
        },
        //通用错误码
        illegalInterface: {
            code: 102001,
            msg: '非法接口',
        },
        error: {
            code: 102002,
            msg: '错误',
        },  
        //用户模块错误码
        notLogin: {
            code: 101000,
            msg: '未登录',
        },
        loginSucc: {
            code: 101001,
            msg: '登录成功',
            flag: 1
        },
        loginFail: {
            code: 101002,
            msg: '用户名或密码错误',
        },
        logout: {
            code: 101003,
            msg: '退出成功',
            flag: 1
        },        
        registerFail: {
            code: 101004,
            msg: '注册失败',
            flag: 1
        },        
        userExist: {
            code: 101005,
            msg: '用户名已存在',
            flag: 1
        },
        //demo模块错误码        
        
    }

};

var paths = config.paths;
var pathKey = '';
var dirKey = '';
for(pathKey in paths){
    dirKey = pathKey.replace(/Path$/, 'Dir');
    config[pathKey] = config.basePath + paths[pathKey];
    config[dirKey] = config.baseDir + paths[pathKey];
}

module.exports = config;
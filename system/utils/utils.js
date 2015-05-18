var _ = require('lodash');
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    output: function(data, errorCode, flag) {
        var errorCodes = global.config.errorCodes || {};
        var outputData = {
            data: data
        };

        if(errorCodes[errorCode]){
            _.extend(outputData, {data: _.clone(errorCodes[errorCode], true)});
            if(!('flag' in outputData.data)){//如果未设置flag 都为0
                outputData.flag = 0;
            }else{//如果设置了flag用flag， 并删除这里的flag
                outputData.flag = outputData.data.flag;
                delete outputData.data.flag;     
            }

        }

        if (typeof flag != 'undefined') {
            outputData.flag = flag;
        }

        if(!('flag' in outputData)){
            outputData.flag = 1;
        }

        return outputData;
    },
    camelCase: function(data) {
        var dataStr = JSON.stringify(data);
        dataStr = dataStr.replace(/"([^"]*)"\s*:/g, snakeToCamelCase);

        return JSON.parse(dataStr);
    },
    snakeCase: function(key) {
        var dataStr = JSON.stringify(data);
        dataStr = dataStr.replace(/"([^"]*)"\s*:/g, camelToSnakeCase);

        return JSON.parse(dataStr);        
    },
    md5: function(text){
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        var pass = md5.update(text).digest('hex');
        
        return pass;
    }

}

function snakeToCamelCase(key) {
    return key.replace(/(_+[a-z0-9])/g, function (snip) {
        return snip.toUpperCase().replace("_", "");
    });
}

function camelToSnakeCase(key) {
    return key.replace(/([A-Za-z])([0-9])/g, function (snip, char, digit) {
        return char + "_" + digit;
    }).replace(/([A-Z])/g, function (snip) {
        return "_" + snip.toLowerCase();
    });
}

module.exports = new Utils();
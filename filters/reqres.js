var _ = require('lodash');

function getData(req, res, next){
           
	var reqData = {};
	var method = req.method;

	if(method === 'POST'){
        reqData = JSON.parse(req.body.data || '{}');
	    _.extend(reqData, req.query);
	}else if(method === 'GET'){
	    reqData = JSON.parse(req.query.data || '{}');
	}
	reqData = q.utils.camelCase(reqData);
	return reqData;
}

function sendData(data, errorCode, flag, req, res, next){
	var sendData = q.utils.output(data, errorCode, flag);
	sendData = q.utils.camelCase(sendData);
	res.send(sendData);	
}


module.exports = function(req, res, next) {
	var args = _.toArray(arguments);

    req.getData = function (){
    	return getData.apply(this, args);
    };
    res.sendData = function (data, errorCode, flag){
    	args.unshift(data, errorCode, flag);
    	sendData.apply(this, args);
    };
    
    next();
};
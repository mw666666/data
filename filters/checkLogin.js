module.exports = function(req, res, next) {
    if(!req.session.user.userName){
    	res.sendData({}, 'notLogin');
    	return ;
    }
    next();//调用下一filter或controller
};
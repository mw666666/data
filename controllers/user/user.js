module.exports = {
    login: function(req, res, next) {
        var that = this;
        var reqData = req.getData();

        var user = {
            user_name: reqData.userName,
            user_pass: q.utils.md5(reqData.userPass),
        };

        this.service().getUser(user, function(data){
            var user = null;
            var sendData = {};

            if(data.length > 0){
                user = data[0];
                req.session.user = req.session.user || {};
                req.session.user.userName = user.user_name;
                res.sendData({
                    userName: user.user_name,
                    userId: user.id,
                });              
            }else{
                res.sendData(sendData, 'loginFail');
            }
            
        });

    },
    logout: function(req, res, next) {
        var that = this;
        var reqData = req.getData();

        var user = {
            user_name: reqData.userName,
            user_pass: reqData.userPass,
        };

        req.session.user = {};
        res.sendData({}, 'logout');

    },
    register: function(req, res) {
        var that = this;
        var reqData = req.getData();

        var user = {
            user_name: reqData.userName,
        };        

        this.service().checkUserNameIsExist(user, function(data){
            // var user = null;
            var sendData = {};
            if(data.length === 0){
                user.user_pass = q.utils.md5(reqData.userPass);

                that.service().add(user, function(data){
                    if(data){
                        user = data;
                        req.session.user = req.session.user || {};
                        req.session.user.userName = user.user_name;
                        res.sendData({
                            userName: user.user_name,
                            userId: user.id,
                        });              
                    }else{
                        res.sendData(sendData, 'registerFail');
                    }            
                });
            }else{
                res.sendData(sendData, 'userExist');
            }
        });

        
    },
}
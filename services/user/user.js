module.exports = {
    getUser: function(user, cb) {
        var that = this;
        
        that.db.User.findAll({where: user}).then(function(data) {
            cb(data);
        });
    },
    checkUserNameIsExist: function(user, cb) {
        var that = this;
        
        that.db.User.findAll({where: user}).then(function(data) {
            cb(data);
        });
    },
    add: function(user, cb) {
        var that = this;
        
        that.db.User.create(user).then(function(data) {
            cb(data);
        });
    }
}
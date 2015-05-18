module.exports = function(Sequelize, DataTypes) {

    var Model = Sequelize.define('Demo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_name: {
            type: DataTypes.STRING,
            field: 'userName'
        },
        user_pass: {
            type: DataTypes.STRING,
            field: 'userPass'
        },
        user_nicename: {
            type: DataTypes.STRING,
            field: 'userNicename'
        },
        user_email: {
            type: DataTypes.STRING,
            field: 'userEmail'
        },
        user_url: {
            type: DataTypes.STRING,
            field: 'userUrl'
        },
        user_registered: {
            type: DataTypes.DATE,
            field: 'userRegistered'
        },
        user_activation_key: {
            type: DataTypes.STRING,
            field: 'userActivationKey'
        },
        user_status: {
            type: DataTypes.INTEGER,
            field: 'userStatus'
        },
        display_name: {
            type: DataTypes.STRING,
            field: 'displayName'
        },
    }, {
        tableName: 'sd_users',
        underscored: true
    });


    return Model;
}
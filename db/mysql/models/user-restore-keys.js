module.exports = (sequelize, DataTypes) => {
    const user_restore_keys = sequelize.define('user_restore_keys', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        }
    }, {
        tableName: "user_restore_keys"
    });
    user_restore_keys.associate = function (models) {
    };
    return user_restore_keys;
};


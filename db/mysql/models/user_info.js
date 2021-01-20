module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        firstName : DataTypes.STRING(32),
        lastName : DataTypes.STRING(32),
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        address2: DataTypes.STRING,
        city: DataTypes.STRING,
        birthDate: DataTypes.DATE,
        userId : {
            type: DataTypes.INTEGER.UNSIGNED,
            reference: {model: "User", key: "id"},
            allowNull:false,
            unique: true,
        }

    }, {
        tableName: "user_infos"
    });
    UserInfo.associate = function(models) {
    };
    return UserInfo;
};
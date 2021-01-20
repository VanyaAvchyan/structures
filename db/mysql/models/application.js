module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        id:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        appId: DataTypes.STRING,
        clientSecret: DataTypes.STRING,
        publicKey: DataTypes.TEXT,
        privateKey: DataTypes.TEXT,
        partnerId : {
            type: DataTypes.INTEGER.UNSIGNED,
            reference: {model: "Partner", key: "id"}
        }

    }, {
        tableName : "applications"
    });
    Application.associate = function(models) {
    };
    return Application;
};


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['suspended', 'active', 'deleted'],
            defaultValue: 'active'
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: DataTypes.STRING,
        frequencyProgramLevelId: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        countryId: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        isSubscribed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        provider: {
            type: DataTypes.ENUM,
            values:  ["rebateMango", "facebook", "dummy"],
            defaultValue:"rebateMango"
        },
        externalId: DataTypes.STRING,
        partnerId : {
            type: DataTypes.INTEGER,
            reference: {model: "Partner", key: "id"}
        },
        applicationId : {
            type: DataTypes.INTEGER.UNSIGNED,
            reference: {model: "Application", key: "id"}
        },
        roleId : {
            type: DataTypes.INTEGER.UNSIGNED,
            reference: {model: "Role", key: "id"}
        },
        mangoes : {
            type: DataTypes.INTEGER.UNSIGNED,
        }
    }, {
        tableName: "users"
    });
    User.associate = function(models) {

    };
    return User;
};

module.exports = (sequelize, DataTypes) => {
    const Partner = sequelize.define('Partner', {
        id:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type:DataTypes.STRING,
            unique:true
        },
        status: {
            type: DataTypes.ENUM,
            values: ["active", "suspended", "deleted"],
            defaultValue: "active"
        },

    }, {
        tableName: "partners"
    });
    Partner.associate = function(models) {

    };
    return Partner;
};

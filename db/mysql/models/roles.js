module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.ENUM,
            values: ["superAdmin", "admin", "manager", "member"],
            allowNull: false,
            unique: true
        },

    }, {
        tableName: "roles"
    });
    Role.associate = function (models) {
    };
    return Role;
};


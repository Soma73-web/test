const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
      },
      lastActivity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      mustChangePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (admin) => {
          if (admin.password) {
            admin.password = await bcrypt.hash(admin.password, 10);
          }
        },
        beforeUpdate: async (admin) => {
          if (admin.changed("password")) {
            admin.password = await bcrypt.hash(admin.password, 10);
          }
        },
      },
    },
  );

  // Instance method to check password
  Admin.prototype.checkPassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  };

  // Instance method to update last activity
  Admin.prototype.updateActivity = async function () {
    this.lastActivity = new Date();
    return this.save();
  };

  return Admin;
};

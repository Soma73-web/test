const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Popup = sequelize.define('Popup', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'popups',
    timestamps: true,
  });
  return Popup;
}; 
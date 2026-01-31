const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lead = sequelize.define('Lead', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        is: /^\d{10}$/,
      },
    },
  }, {
    tableName: 'leads',
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  });

  // Add a static config table for popup enabled/disabled
  const LeadPopupConfig = sequelize.define('LeadPopupConfig', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'lead_popup_config',
    timestamps: false,
  });

  sequelize.LeadPopupConfig = LeadPopupConfig;

  return Lead;
}; 
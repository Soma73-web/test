module.exports = (sequelize, DataTypes) => {
  const Download = sequelize.define(
    "Download",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "downloads",
      timestamps: false,
    },
  );

  return Download;
};

module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define(
    "Result",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      college: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      image_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "image/jpeg",
      },
    },
    {
      tableName: "results",
      timestamps: false,
    },
  );

  return Result;
};

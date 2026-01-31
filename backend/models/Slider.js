module.exports = (sequelize, DataTypes) => {
  const Slider = sequelize.define(
    "Slider",
    {
      photo: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "image/jpeg",
      },
    },
    {
      tableName: "Sliders",
      timestamps: false,
    },
  );

  return Slider;
};

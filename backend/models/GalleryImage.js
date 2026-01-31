module.exports = (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define(
    "GalleryImage",
    {
      title: {
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
      },
    },
    {
      tableName: "gallery_images",
      timestamps: false,
    },
  );

  return GalleryImage;
};

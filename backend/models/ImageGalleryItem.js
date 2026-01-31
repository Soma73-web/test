module.exports = (sequelize, DataTypes) => {
  const ImageGalleryItem = sequelize.define(
    "ImageGalleryItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "gallery_categories", key: "id" },
      },
      image_url: { type: DataTypes.TEXT("long"), allowNull: false },
    },
    {
      tableName: "categorized_gallery_images",
      timestamps: false,
    },
  );

  ImageGalleryItem.associate = (models) => {
    ImageGalleryItem.belongsTo(models.GalleryCategory, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return ImageGalleryItem;
};

module.exports = (sequelize, DataTypes) => {
  const CategorizedGalleryImage = sequelize.define('CategorizedGalleryImage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    image_url: { type: DataTypes.STRING, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'categorized_gallery_images',
    timestamps: false,
  });

  CategorizedGalleryImage.associate = (models) => {
    CategorizedGalleryImage.belongsTo(models.GalleryCategory, { foreignKey: 'category_id' });
  };

  return CategorizedGalleryImage;
}; 
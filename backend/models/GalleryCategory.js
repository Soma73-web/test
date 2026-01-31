module.exports = (sequelize, DataTypes) => {
  const GalleryCategory = sequelize.define('GalleryCategory', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'gallery_categories',
    timestamps: false,
  });

  GalleryCategory.associate = (models) => {
    GalleryCategory.hasMany(models.CategorizedGalleryImage, { foreignKey: 'category_id' });
  };

  return GalleryCategory;
};

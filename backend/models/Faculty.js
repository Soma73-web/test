module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_data: {
      type: DataTypes.BLOB('long'), // store binary image data in DB
      allowNull: true,
    },
    image_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'faculty',
    timestamps: true,
  });
  return Faculty;
}; 
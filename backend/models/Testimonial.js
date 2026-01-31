module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      video_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instagram_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "testimonials",
      timestamps: false,
    },
  );

  return Testimonial;
};

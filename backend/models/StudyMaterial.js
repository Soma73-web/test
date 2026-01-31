module.exports = (sequelize, DataTypes) => {
  const StudyMaterial = sequelize.define(
    "StudyMaterial",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.ENUM("Biology", "Chemistry", "Physics", "Mathematics"),
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      addedBy: {
        type: DataTypes.STRING,
        defaultValue: "admin",
      },
    },
    {
      tableName: "study_materials",
      timestamps: true,
      indexes: [
        {
          fields: ["subject", "orderIndex"],
        },
        {
          fields: ["isActive"],
        },
      ],
    },
  );

  return StudyMaterial;
};

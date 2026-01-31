module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late"),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Reason for absence or late arrival",
      },
      markedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Admin who marked the attendance",
      },
    },
    {
      tableName: "attendance",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["studentId", "date"],
        },
      ],
    },
  );

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });
  };

  return Attendance;
};

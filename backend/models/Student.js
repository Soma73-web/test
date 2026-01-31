module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      batch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "students",
      timestamps: true,
    },
  );

  Student.associate = (models) => {
    Student.hasMany(models.Attendance, {
      foreignKey: "studentId",
      as: "attendances",
    });
    Student.hasMany(models.TestResult, {
      foreignKey: "studentId",
      as: "testResults",
    });
  };

  return Student;
};

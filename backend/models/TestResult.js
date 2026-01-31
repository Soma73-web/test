module.exports = (sequelize, DataTypes) => {
  const TestResult = sequelize.define(
    "TestResult",
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
      testNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      obtainedMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      testDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      addedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Admin who added the result",
      },
    },
    {
      tableName: "test_results",
      timestamps: true,
      indexes: [
        {
          fields: ["studentId", "testNumber"],
        },
      ],
    },
  );

  TestResult.associate = (models) => {
    TestResult.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });
  };

  return TestResult;
};

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('testimonials', 'instagram_link', {
      type: DataTypes.TEXT,
      allowNull: true,
      after: 'video_link'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('testimonials', 'instagram_link');
  }
}; 
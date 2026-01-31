const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // Only use SSL if explicitly enabled
      ...(process.env.DB_SSL === 'true' && {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      })
    }
  }
);

// Check for required env variables
const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredVars.forEach((v) => {
  if (!process.env[v]) {
    console.error(`Missing required environment variable: ${v}`);
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Uncomment the line below to test connection when this file is loaded
// testConnection();

module.exports = sequelize; 
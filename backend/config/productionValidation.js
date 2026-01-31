// Production environment validation
const validateProductionConfig = () => {
  const requiredVars = [
    'DB_HOST',
    'DB_PORT', 
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please set these variables before starting in production mode.');
    process.exit(1);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long for production');
    process.exit(1);
  }

  // Validate database connection
  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    console.error('❌ Database configuration is incomplete');
    process.exit(1);
  }

  console.log('✅ Production environment validation passed');
  return true;
};

module.exports = { validateProductionConfig }; 
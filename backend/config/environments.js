const environments = {
  development: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'mysql',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    storage: {
      accountName: process.env.STORAGE_ACCOUNT,
      accountKey: process.env.STORAGE_KEY,
      containerName: 'uploads'
    },
    cors: {
      origin: [process.env.FRONTEND_URL_DEV],
      credentials: true
    },
    port: process.env.PORT || 5000
  },
  
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'mysql',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    storage: {
      accountName: process.env.STORAGE_ACCOUNT,
      accountKey: process.env.STORAGE_KEY,
      containerName: 'uploads'
    },
    cors: {
      origin: [process.env.FRONTEND_URL_PROD],
      credentials: true
    },
    port: process.env.PORT || 5000
  }
};

// Check for required env variables
const requiredVars = [
  'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'STORAGE_ACCOUNT', 'STORAGE_KEY',
  'FRONTEND_URL_DEV', 'FRONTEND_URL_PROD',
  'JWT_SECRET'
];

// Optional AI API keys (at least one is recommended)
const optionalAiKeys = [
  'PERPLEXITY_API_KEY', 'OPENAI_API_KEY', 'HUGGINGFACE_API_KEY', 'COHERE_API_KEY', 'OLLAMA_URL', 'OLLAMA_MODEL'
];
requiredVars.forEach((v) => {
  if (!process.env[v]) {
    console.error(`Missing required environment variable: ${v}`);
  }
});

const currentEnv = process.env.NODE_ENV || 'development';
module.exports = environments[currentEnv]; 
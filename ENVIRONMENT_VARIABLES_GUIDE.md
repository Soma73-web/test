# Environment Variables Configuration Guide

## Overview

All credentials, API keys, and sensitive configuration should be stored in environment variables, NOT hardcoded in the application. This guide documents all environment variables used in the NEET Academy application.

---

## ✅ Verified Environment Variables Usage

### Backend - All variables are correctly using `process.env`

#### Database Configuration
```javascript
// config/db.js
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}
```

#### Authentication & Security
```javascript
// controllers/studentController.js, routes/admin.js, routes/studentRoutes.js
const jwtSecret = process.env.JWT_SECRET;
const token = jwt.sign(payload, jwtSecret, { expiresIn: "8h" });
```

#### AI API Keys
```javascript
// routes/chatbotRoutes.js
const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
```

#### Storage Configuration
```javascript
// config/environments.js
{
  accountName: process.env.STORAGE_ACCOUNT,
  accountKey: process.env.STORAGE_KEY,
  containerName: process.env.STORAGE_CONTAINER
}
```

#### CORS & Frontend URLs
```javascript
// config/environments.js
cors: {
  origin: [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL_PROD],
  credentials: true
}
```

### Frontend - Variables with REACT_APP_ prefix

#### API Configuration
```javascript
// src/pages/StudentLogin.jsx, src/api.js
const API_BASE = process.env.REACT_APP_API_BASE_URL;
```

#### Feature Flags
```javascript
// src/App.jsx
const enableChatbot = process.env.REACT_APP_ENABLE_CHATBOT === 'true';
const enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
```

---

## 📋 Complete Environment Variables Reference

### Backend (.env)

#### Database Configuration
```env
DB_HOST=localhost                    # Database host
DB_PORT=3306                         # MySQL port
DB_USER=neet_user                    # Database username
DB_PASSWORD=secure_password          # Database password
DB_NAME=neet_academy                 # Database name
```

#### Server Configuration
```env
PORT=5000                            # Server port
NODE_ENV=development                 # development | production
```

#### Security
```env
JWT_SECRET=your_32_char_secret_key   # JWT signing key (min 32 chars)
JWT_EXPIRATION=8h                    # Token expiration time
SESSION_TIMEOUT=1800000              # Session timeout in ms (30 mins)
MAX_LOGIN_ATTEMPTS=5                 # Max login attempts before lockout
LOCKOUT_TIME=300000                  # Lockout duration in ms (5 mins)
```

#### Frontend URLs
```env
FRONTEND_URL_DEV=http://localhost:3000
FRONTEND_URL_PROD=https://your-domain.com
```

#### Storage (Azure)
```env
STORAGE_ACCOUNT=your_account_name
STORAGE_KEY=your_storage_key
STORAGE_CONTAINER=uploads
```

#### AI & Chatbot APIs
```env
# Hugging Face (Free: 30,000 req/month)
HUGGINGFACE_API_KEY=hf_xxxxx

# OpenAI (Optional, requires paid account)
OPENAI_API_KEY=sk_xxxxx

# Perplexity (Optional)
PERPLEXITY_API_KEY=pplx_xxxxx

# Cohere (Optional, free tier available)
COHERE_API_KEY=cohere_xxxxx

# Local OLLAMA (Optional, for offline LLM)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

#### Email Configuration (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@neetacademy.com
```

#### Redis (Optional - for caching)
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

#### Logging
```env
LOG_LEVEL=info                       # debug | info | warn | error
LOG_DIR=./logs
```

#### CORS
```env
CORS_ORIGIN=http://localhost:3000,https://your-domain.com
```

#### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100          # Max requests per window
```

#### Admin Setup (One-time only)
```env
ADMIN_EMAIL=admin@neetacademy.com
ADMIN_PASSWORD=secure_password
ADMIN_NAME=Administrator
```

---

### Frontend (.env.local or .env)

#### API Configuration
```env
REACT_APP_API_BASE_URL=http://localhost:5000  # Backend API URL
```

#### Application Settings
```env
REACT_APP_APP_NAME=NEET Academy
REACT_APP_APP_VERSION=1.0.0
```

#### Feature Flags
```env
REACT_APP_ENABLE_CHATBOT=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_LEAD_POPUP=true
```

#### Session Configuration
```env
REACT_APP_SESSION_TIMEOUT=1800000   # 30 minutes in milliseconds
```

#### Optional Analytics
```env
REACT_APP_GOOGLE_ANALYTICS_ID=      # Google Analytics tracking ID
```

#### Build Settings
```env
GENERATE_SOURCEMAP=true             # true for dev, false for prod
SKIP_PREFLIGHT_CHECK=false
```

---

## 🚀 Setup Instructions

### Step 1: Create Environment Files

**Backend:**
```bash
cd backend
cp .env.example .env
nano .env  # Edit with your values
```

**Frontend:**
```bash
cd client
cp .env.example .env.local
nano .env.local  # Edit with your values
```

### Step 2: Configure Database

```bash
# Create database
mysql -u root -p
CREATE DATABASE neet_academy;
CREATE USER 'neet_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON neet_academy.* TO 'neet_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update .env Files

**backend/.env** (Essential)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=neet_user
DB_PASSWORD=your_secure_password
DB_NAME=neet_academy
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
NODE_ENV=development
FRONTEND_URL_DEV=http://localhost:3000
PORT=5000
```

**client/.env.local** (Essential)
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Step 4: Add Optional API Keys

Get free API keys from:

1. **HuggingFace** (Free tier: 30,000 requests/month)
   - URL: https://huggingface.co/settings/tokens
   - Add to .env: `HUGGINGFACE_API_KEY=hf_xxxxx`

2. **OpenAI** (Paid)
   - URL: https://platform.openai.com/api-keys
   - Add to .env: `OPENAI_API_KEY=sk_xxxxx`

3. **Perplexity** (Free tier available)
   - URL: https://www.perplexity.ai/
   - Add to .env: `PERPLEXITY_API_KEY=pplx_xxxxx`

4. **Cohere** (Free tier: 100 API calls/month)
   - URL: https://dashboard.cohere.com/
   - Add to .env: `COHERE_API_KEY=cohere_xxxxx`

### Step 5: Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm start
# App opens at http://localhost:3000
```

---

## 🔒 Security Best Practices

### DO ✅
- Store all credentials in `.env` files
- Use strong, random values for secrets
- Rotate API keys regularly
- Use different keys for dev and production
- Keep JWT_SECRET at least 32 characters
- Monitor API usage and costs
- Use minimal permissions for database users
- Enable HTTPS in production

### DON'T ❌
- Never commit `.env` files to Git
- Never hardcode passwords or API keys in code
- Never share `.env` files via email or chat
- Never log sensitive data
- Never use the same key for dev and production
- Never use weak passwords
- Never expose API keys in frontend code
- Never use default credentials in production

---

## 📝 Git Configuration

Add `.env` files to `.gitignore`:

```bash
# .gitignore
backend/.env
backend/.env.local
backend/.env.*.local

client/.env
client/.env.local
client/.env.*.local

# Keep .env.example files in Git
!backend/.env.example
!client/.env.example
```

---

## 🧪 Verify Configuration

### Check Backend Variables
```bash
cd backend
node -e "require('dotenv').config(); 
console.log('DB:', process.env.DB_HOST, process.env.DB_NAME);
console.log('JWT:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('Frontend URL:', process.env.FRONTEND_URL_DEV);"
```

### Check Frontend Variables
```bash
cd client
echo "API Base: $REACT_APP_API_BASE_URL"
```

### Verify Database Connection
```bash
mysql -u neet_user -p -h localhost neet_academy -e "SELECT 1;"
# Should return: 1
```

---

## 📊 Environment Comparison

| Variable | Development | Staging | Production |
|----------|-------------|---------|-----------|
| NODE_ENV | development | staging | production |
| DB_HOST | localhost | internal.db | prod.db.aws.com |
| JWT_SECRET | dev-secret-123 | staging-secret-456 | prod-secret-789 (32+ chars) |
| HTTPS | No (HTTP) | Yes | Yes |
| DEBUG | true | false | false |
| LOG_LEVEL | debug | info | warn |
| Session Timeout | 30 mins | 30 mins | 15 mins |

---

## 🆘 Troubleshooting

### "JWT_SECRET environment variable is required"
**Solution:** Set `JWT_SECRET` in `.env` file (minimum 32 characters)

### "Cannot find module dotenv"
**Solution:** Ensure `require("dotenv").config()` is at the top of `backend/server.js`

### "Database connection failed"
**Solution:** Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env

### "API_BASE_URL is undefined"
**Solution:** Ensure `.env.local` has `REACT_APP_API_BASE_URL=http://localhost:5000`

### "HUGGINGFACE_API_KEY not configured"
**Solution:** This is optional. Get a free key from https://huggingface.co/settings/tokens

### "Cannot resolve process.env in frontend"
**Solution:** Frontend variables must start with `REACT_APP_` prefix

---

## ✨ Summary

All sensitive information is now managed through environment variables:

✅ Database credentials  
✅ JWT secrets  
✅ API keys (HuggingFace, OpenAI, etc.)  
✅ Storage credentials  
✅ Frontend URLs  
✅ Session configuration  

The application is secure and production-ready! 🚀

---

**Last Updated:** February 1, 2026  
**Version:** 1.0.0

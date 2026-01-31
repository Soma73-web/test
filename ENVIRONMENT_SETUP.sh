#!/bin/bash

# ============================================
# ENVIRONMENT CONFIGURATION SETUP GUIDE
# ============================================
# This guide helps you set up all environment variables
# for development and production environments

echo "🔐 NEET Academy - Environment Configuration Guide"
echo "=============================================="
echo ""

# Check for existing .env files
echo "📋 Checking existing configuration files..."
echo ""

# Backend
echo "Backend Environment:"
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env exists"
else
    echo "❌ backend/.env NOT found"
    echo "   Run: cp backend/.env.example backend/.env"
fi

# Frontend
echo ""
echo "Frontend Environment:"
if [ -f "client/.env.local" ]; then
    echo "✅ client/.env.local exists"
elif [ -f "client/.env" ]; then
    echo "⚠️  client/.env exists (should use .env.local for local dev)"
else
    echo "❌ client/.env.local NOT found"
    echo "   Run: cp client/.env.example client/.env.local"
fi

echo ""
echo "📝 Required Configuration Steps:"
echo "================================"
echo ""

echo "1. Backend Configuration (.env):"
echo "   cd backend"
echo "   cp .env.example .env"
echo "   nano .env  # or use your preferred editor"
echo ""
echo "   Essential variables:"
echo "   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
echo "   - JWT_SECRET (at least 32 characters)"
echo "   - NODE_ENV (development or production)"
echo ""

echo "2. Frontend Configuration (.env.local):"
echo "   cd client"
echo "   cp .env.example .env.local"
echo "   nano .env.local"
echo ""
echo "   Essential variables:"
echo "   - REACT_APP_API_BASE_URL (http://localhost:5000 for dev)"
echo ""

echo "3. Optional AI API Keys:"
echo "   Get free API keys from:"
echo "   - HuggingFace: https://huggingface.co/settings/tokens"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - Perplexity: https://www.perplexity.ai/"
echo "   - Cohere: https://dashboard.cohere.com/"
echo ""

echo "4. Database Setup:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE neet_academy;"
echo "   CREATE USER 'neet_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "   GRANT ALL PRIVILEGES ON neet_academy.* TO 'neet_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo ""

echo "5. Start the Application:"
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm install && npm start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd client && npm install && npm start"
echo ""

echo "✅ All environment variables are now from .env files"
echo "🔒 Never commit .env files to version control"
echo "📚 See .env.example files for all available options"
echo ""

echo "🚀 Environment variables used in application:"
echo "=============================================="
echo ""

# Backend
echo "Backend Environment Variables:"
grep -E "^\s*process\.env\." backend/routes/*.js backend/controllers/*.js backend/config/*.js 2>/dev/null | \
  sed 's/.*process\.env\.\([A-Z_]*\).*/  - \1/' | sort -u | head -20

echo ""
echo "Frontend Environment Variables:"
grep -E "process\.env\.REACT_APP_" client/src/**/*.{js,jsx} 2>/dev/null | \
  sed 's/.*process\.env\.\(REACT_APP_[A-Z_]*\).*/  - \1/' | sort -u | head -20

echo ""
echo "✨ Setup complete! Your application is now secure."

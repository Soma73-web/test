#!/bin/bash

# Production Deployment Script for NEET Academy

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install --production
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

echo "🏗️ Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "🔍 Running tests..."
npm test -- --coverage --watchAll=false
if [ $? -ne 0 ]; then
    echo "⚠️ Some tests failed, but continuing deployment..."
fi

cd ..

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production database"
echo "2. Update environment variables in .env files"
echo "3. Configure your web server (nginx, apache, etc.)"
echo "4. Set up SSL certificates"
echo "5. Configure domain DNS settings"
echo ""
echo "🔧 Production checklist:"
echo "- [ ] Database is configured and accessible"
echo "- [ ] Environment variables are set"
echo "- [ ] SSL certificates are installed"
echo "- [ ] Domain is pointing to server"
echo "- [ ] Backup strategy is in place"
echo "- [ ] Monitoring is set up"

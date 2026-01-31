#!/bin/bash
set -e

echo "🔧 Starting build process..."

# Clean existing installations
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json || true

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force || true

# Install dependencies with explicit flags
echo "📦 Installing dependencies..."
npm install --no-optional --production=false

# Verify Express installation
echo "🔍 Verifying Express installation..."
if [ ! -f "node_modules/express/lib/router/index.js" ]; then
    echo "❌ Express router not found, reinstalling..."
    npm uninstall express
    npm install express@4.21.2
fi

# Final verification
echo "✅ Verifying all critical modules..."
node -e "
try {
  require('express');
  require('cors');
  require('dotenv');
  console.log('✅ All dependencies verified successfully');
} catch (error) {
  console.error('❌ Dependency verification failed:', error.message);
  process.exit(1);
}
"

echo "🎉 Build completed successfully!"

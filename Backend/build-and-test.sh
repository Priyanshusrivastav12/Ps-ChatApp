#!/bin/bash

echo "🚀 Building Chat App for Production..."

# Navigate to the Backend directory
cd "$(dirname "$0")"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd Frontend
npm install

echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Frontend build successful! dist/ directory created."
    echo "📁 Contents of dist/:"
    ls -la dist/
else
    echo "❌ Frontend build failed! dist/ directory not found."
    exit 1
fi

cd ..

# Check if all required files exist
echo "🔍 Checking deployment files..."
if [ -f "Frontend/dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html not found in Frontend/dist/"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "📝 To test locally with production settings:"
echo "   export NODE_ENV=production"
echo "   npm start"
echo ""
echo "🚀 Ready for deployment to Render!"

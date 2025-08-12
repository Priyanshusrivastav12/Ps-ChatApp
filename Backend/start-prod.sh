#!/bin/bash

echo "🏭 Starting Chat App in Production Mode..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Navigate to the Backend directory
cd "$(dirname "$0")"

# Check if .env.production file exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    print_status "Creating .env.production file from template..."
    cat > .env.production << 'EOF'
# Production Environment Configuration
NODE_ENV=production
PORT=10000

# Database Configuration
MONGODB_URI="mongodb+srv://priyanshusrivastav548:Priyanshu@cluster0.rze7dxw.mongodb.net/chatapp?retryWrites=true&w=majority"

# JWT Configuration  
JWT_SECRET=your_production_jwt_secret_key_here_make_it_very_secure_and_long

# Application URLs
FRONTEND_URL=https://ps-chatapp.onrender.com
BACKEND_URL=https://ps-chatapp.onrender.com
EOF
    print_status ".env.production file created! Please update the values as needed."
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd Frontend
npm install

# Create frontend .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_status "Creating frontend .env.production file..."
    cat > .env.production << 'EOF'
# Frontend Environment Variables - Production
VITE_API_BASE_URL=https://ps-chatapp.onrender.com
VITE_SOCKET_URL=https://ps-chatapp.onrender.com
EOF
fi

# Build frontend
print_status "Building frontend for production..."
npm run build:prod

# Check if build was successful
if [ -d "dist" ]; then
    print_status "✅ Frontend build successful!"
    print_status "📁 Contents of dist/:"
    ls -la dist/
else
    print_error "❌ Frontend build failed! dist/ directory not found."
    exit 1
fi

cd ..

# Check if all required files exist
print_status "🔍 Checking deployment files..."
if [ -f "Frontend/dist/index.html" ]; then
    print_status "✅ index.html found"
else
    print_error "❌ index.html not found in Frontend/dist/"
    exit 1
fi

print_status "🚀 Starting production server..."
NODE_ENV=production npm start

print_status "🎉 Production server started!"
print_status "🌐 Access the app at: http://localhost:10000 (or your configured PORT)"

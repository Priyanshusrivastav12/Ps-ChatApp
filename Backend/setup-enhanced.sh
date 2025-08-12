#!/bin/bash

# ChatApp Enhanced Setup Script
echo "🚀 Setting up ChatApp with enhanced features..."

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
npm install

echo "📦 Installing frontend dependencies..."
cd Frontend
npm install

# Install additional dependencies for new features
echo "🔧 Installing enhanced features dependencies..."
npm install react-icons react-hot-toast socket.io-client axios

cd ..

echo "🔧 Installing additional backend dependencies..."
npm install multer cloudinary nodemailer crypto

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Development Environment Variables
NODE_ENV=development
PORT=4001
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4001

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (Optional for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOL
    echo "✅ Created .env file with default values"
    echo "⚠️  Please update the environment variables in .env file"
fi

if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    cat > .env.production << EOL
# Production Environment Variables
NODE_ENV=production
PORT=4001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=your-production-frontend-url
BACKEND_URL=your-production-backend-url

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOL
    echo "✅ Created .env.production file"
fi

# Create frontend environment file
cd Frontend
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOL
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
EOL
    echo "✅ Created frontend .env file"
fi

if [ ! -f .env.production ]; then
    echo "📝 Creating frontend .env.production file..."
    cat > .env.production << EOL
# Frontend Production Environment Variables
VITE_API_BASE_URL=your-production-backend-url
VITE_SOCKET_URL=your-production-backend-url
EOL
    echo "✅ Created frontend .env.production file"
fi

cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads/avatars
mkdir -p uploads/files
mkdir -p uploads/images
mkdir -p logs

# Make scripts executable
chmod +x start-dev.sh
chmod +x start-prod.sh
chmod +x build-and-test.sh

echo ""
echo "🎉 ChatApp Enhanced Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update environment variables in .env files"
echo "2. Start MongoDB locally or update MONGODB_URI"
echo "3. Run 'npm run dev' to start development server"
echo ""
echo "🚀 Available Commands:"
echo "  npm run dev        - Start development server"
echo "  npm run start      - Start production server"
echo "  npm run build      - Build for production"
echo "  ./start-dev.sh     - Start with development environment"
echo "  ./start-prod.sh    - Start with production environment"
echo ""
echo "✨ New Features Added:"
echo "  📄 File upload and sharing"
echo "  🔍 Message search functionality"
echo "  📱 Push notifications"
echo "  👤 User profiles and status"
echo "  ✅ Message status indicators"
echo "  😊 Message reactions"
echo "  💬 Reply to messages"
echo "  🎨 Enhanced UI animations"
echo ""
echo "🔧 Need help? Check the documentation or run 'npm run help'"

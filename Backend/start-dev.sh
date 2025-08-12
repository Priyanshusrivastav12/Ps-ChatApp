#!/bin/bash

echo "🚀 Starting Chat App in Development Mode..."

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

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_status "Creating .env file from template..."
    cat > .env << 'EOF'
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration
MONGODB_URI="mongodb+srv://priyanshusrivastav548:Priyanshu@cluster0.rze7dxw.mongodb.net/chatapp?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this_in_production

# CORS Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4001

# Production URLs (used when NODE_ENV=production)
PRODUCTION_FRONTEND_URL=https://ps-chatapp.onrender.com
PRODUCTION_BACKEND_URL=https://ps-chatapp.onrender.com
EOF
    print_status ".env file created! Please update the values as needed."
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "Frontend/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd Frontend
    npm install
    cd ..
fi

# Create frontend .env if it doesn't exist
if [ ! -f "Frontend/.env" ]; then
    print_status "Creating frontend .env file..."
    cat > Frontend/.env << 'EOF'
# Frontend Environment Variables - Development
VITE_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
VITE_APP_NAME=ChatApp
VITE_APP_VERSION=1.0.0
EOF
fi

print_status "Starting development servers..."
print_warning "Make sure MongoDB is running and accessible!"

# Function to kill processes on script exit
cleanup() {
    print_status "Cleaning up processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

# Start backend server
print_status "Starting backend server on port 4001..."
NODE_ENV=development npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend server
print_status "Starting frontend development server on port 5173..."
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

print_status "🎉 Development servers started!"
print_status "📡 Backend: http://localhost:4001"
print_status "🌐 Frontend: http://localhost:5173"
print_status "🔍 API Health: http://localhost:4001/health"
print_warning "Press Ctrl+C to stop both servers"

# Wait for processes
wait

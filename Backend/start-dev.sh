#!/bin/bash

echo "🚀 Starting Chat App in Development Mode..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Navigate to the Backend directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cat > .env << 'EOF'
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration
MONGODB_URI="mongodb+srv://priyanshusrivastav548:Priyanshu@cluster0.rze7dxw.mongodb.net/chatapp?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this_in_production

# Application URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:4001
EOF
    print_status ".env file created! Please update the values as needed."
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

if [ ! -d "Frontend/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd Frontend && npm install && cd ..
fi

# Create frontend .env if it doesn't exist
if [ ! -f "Frontend/.env" ]; then
    print_status "Creating frontend .env file..."
    cat > Frontend/.env << 'EOF'
# Frontend Environment Variables - Development
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
EOF
fi

print_status "🚀 Starting development servers..."
print_status "📡 Backend: http://localhost:4001"
print_status "🌐 Frontend: http://localhost:5174"
print_warning "Press Ctrl+C to stop the server"

# Start backend server
NODE_ENV=development npm run dev

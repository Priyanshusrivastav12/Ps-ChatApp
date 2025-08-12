# 🚀 ChatApp Production Setup Guide

This document outlines the simplified production-grade environment configuration for the ChatApp MERN stack application.

## 📁 Key Files
```
Backend/
├── .env                    # Development environment variables
├── .env.production        # Production environment variables  
├── start-dev.sh          # Development startup script
├── start-prod.sh         # Production startup script
├── index.js              # Main server file
├── Frontend/
│   ├── .env              # Frontend development variables
│   ├── .env.production   # Frontend production variables
│   ├── src/config/api.js # API configuration helper
│   └── vite.config.js    # Vite configuration
└── ...
```

## 🌍 Environment Configuration

### Backend Environment Variables

#### Development (`.env`)
```env
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration
MONGODB_URI="your_mongodb_connection_string"

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Application URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:4001
```

#### Production (`.env.production`)
```env
# Production Environment Configuration
NODE_ENV=production
PORT=10000

# Database Configuration
MONGODB_URI="your_production_mongodb_connection_string"

# JWT Configuration  
JWT_SECRET=your_production_jwt_secret_key_here_make_it_very_secure_and_long

# Application URLs
FRONTEND_URL=https://ps-chatapp.onrender.com
BACKEND_URL=https://ps-chatapp.onrender.com
```

### Frontend Environment Variables

#### Development (`Frontend/.env`)
```env
# Frontend Environment Variables - Development
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
```

#### Production (`Frontend/.env.production`)
```env
# Frontend Environment Variables - Production
VITE_API_BASE_URL=https://ps-chatapp.onrender.com
VITE_SOCKET_URL=https://ps-chatapp.onrender.com
```

## 🔧 Key Features

### 1. Simplified Configuration
- **Just 2 URLs**: `FRONTEND_URL` and `BACKEND_URL` 
- **Easy switching**: Change URLs for local/production
- **No complex naming**: No multiple environment prefixes
- **Automatic detection**: Environment-aware CORS and Socket.IO

### 2. Environment-Aware CORS
- **Development**: Allows common localhost ports automatically
- **Production**: Uses only the specified `FRONTEND_URL`
- **Dynamic origins**: Automatically includes the environment URL

### 3. Socket.IO Configuration
- **Single source of truth**: Uses `FRONTEND_URL` from environment
- **Development friendly**: Includes common localhost ports
- **Production secure**: Only allows specified origin

## 🚀 Running the Application

### Development Mode
```bash
# Option 1: Use the development script
./start-dev.sh

# Option 2: Manual startup
npm run dev                 # Backend (port 4001)
cd Frontend && npm run dev  # Frontend (port 5174)
```

**URLs:**
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:4001
- **API Health**: http://localhost:4001/health

### Production Mode
```bash
# Option 1: Use the production script
./start-prod.sh

# Option 2: Manual startup
npm run build              # Build frontend
NODE_ENV=production npm start
```

**URLs:**
- **Application**: Your configured PORT (default: 10000)
- **API Health**: /health endpoint

## 🌐 Deployment Configuration

### For Local Development
In your `.env` file:
```env
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:4001
```

In your `Frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
```

### For Production Deployment
In your `.env.production` file:
```env
FRONTEND_URL=https://your-app.onrender.com
BACKEND_URL=https://your-app.onrender.com
```

In your `Frontend/.env.production` file:
```env
VITE_API_BASE_URL=https://your-app.onrender.com
VITE_SOCKET_URL=https://your-app.onrender.com
```

### Render.com Environment Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret_key
FRONTEND_URL=https://your-app.onrender.com
BACKEND_URL=https://your-app.onrender.com
```

## 📦 Quick Setup

### First Time Setup
```bash
# Clone and setup
git clone <your-repo>
cd chatapp/Backend

# For development
./start-dev.sh

# For production
./start-prod.sh
```

### Switching Environments
```bash
# Development → Production
# Just change URLs in .env files and restart

# Local URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:4001

# Production URLs  
FRONTEND_URL=https://your-app.onrender.com
BACKEND_URL=https://your-app.onrender.com
```

## � API Endpoints

- `GET /` - Server status and configuration info
- `GET /health` - Health check
- `GET /api` - API information
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login  
- `POST /api/user/logout` - User logout
- `GET /api/user/allusers` - Get all users
- `POST /api/message/send/:id` - Send message
- `GET /api/message/get/:id` - Get messages

## 🛠️ Troubleshooting

### CORS Issues
1. Check `FRONTEND_URL` in backend `.env`
2. Verify frontend is running on the specified URL
3. Ensure both backend and frontend use same protocol (http/https)

### Socket.IO Connection Issues  
1. Verify `VITE_SOCKET_URL` matches backend URL
2. Check WebSocket support
3. Ensure CORS allows the frontend origin

### Build Issues
1. Run `npm install` in both Backend and Frontend
2. Check environment variables are set
3. Verify all dependencies are installed

This simplified setup makes it much easier to manage different environments while maintaining security and flexibility!

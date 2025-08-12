# 🚀 ChatApp Production Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the ChatApp in a production-grade environment. The application has been configured with proper environment management, security measures, and scalability considerations.

## 🏗️ Architecture

```
Frontend (React + Vite) ←→ Backend (Node.js + Express) ←→ MongoDB Atlas
                              ↕
                         Socket.IO (Real-time)
```

## 🌍 Environment Configuration

### Development Environment
- **Backend**: http://localhost:4001
- **Frontend**: http://localhost:5174
- **Database**: MongoDB Atlas (Cloud)
- **Environment**: `NODE_ENV=development`

### Production Environment
- **Backend**: https://ps-chatapp.onrender.com
- **Frontend**: https://ps-chatapp.onrender.com
- **Database**: MongoDB Atlas (Cloud)
- **Environment**: `NODE_ENV=production`

## 📁 Environment Files

### Backend Environment Files

#### `.env` (Development)
```env
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/chatapp"

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:4001

# Production URLs
PRODUCTION_FRONTEND_URL=https://ps-chatapp.onrender.com
PRODUCTION_BACKEND_URL=https://ps-chatapp.onrender.com
```

#### `.env.production` (Production)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/chatapp"
JWT_SECRET=your_production_jwt_secret_key_here_make_it_very_secure_and_long
FRONTEND_URL=https://ps-chatapp.onrender.com
BACKEND_URL=https://ps-chatapp.onrender.com
```

### Frontend Environment Files

#### `.env` (Development)
```env
VITE_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
VITE_APP_NAME=ChatApp
VITE_APP_VERSION=1.0.0
```

#### `.env.production` (Production)
```env
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://ps-chatapp.onrender.com
VITE_SOCKET_URL=https://ps-chatapp.onrender.com
VITE_APP_NAME=ChatApp
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment Steps

### 1. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Priyanshusrivastav12/Ps-ChatApp.git
cd Ps-ChatApp

# Setup backend
cd Backend
npm install

# Setup frontend
cd Frontend
npm install
cd ..

# Start development servers
npm run dev          # Start backend in development mode
cd Frontend
npm run dev          # Start frontend in development mode
```

### 2. Production Build

```bash
# Build for production
npm run build        # This builds both backend and frontend

# Or build separately
npm run build:frontend  # Build only frontend
cd Frontend
npm run build:prod     # Build frontend with production config
```

### 3. Production Deployment (Render)

#### Environment Variables to Set in Render:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_very_secure_production_jwt_secret
FRONTEND_URL=https://ps-chatapp.onrender.com
BACKEND_URL=https://ps-chatapp.onrender.com
```

#### Build Command:
```bash
npm run build
```

#### Start Command:
```bash
npm start
```

## 🔧 Configuration Features

### Backend Features
- ✅ Environment-specific CORS configuration
- ✅ Dynamic Socket.IO origins based on environment
- ✅ Secure JWT token handling
- ✅ Environment-specific cookie settings
- ✅ Comprehensive error handling
- ✅ Health check endpoints
- ✅ API documentation endpoint
- ✅ Content Security Policy headers
- ✅ MongoDB connection with error handling

### Frontend Features
- ✅ Environment-specific API base URLs
- ✅ Dynamic Socket.IO connection URLs
- ✅ Axios configuration with timeouts
- ✅ Build optimization for production
- ✅ Code splitting and chunking
- ✅ Environment variable validation
- ✅ Comprehensive error handling

### Security Features
- ✅ CORS properly configured for each environment
- ✅ JWT tokens with secure settings
- ✅ HTTP-only cookies in production
- ✅ SameSite cookie protection
- ✅ Content Security Policy headers
- ✅ Input validation and sanitization

## 📊 API Endpoints

### Health & Info Endpoints
- `GET /` - Server status and information
- `GET /health` - Health check endpoint
- `GET /api` - API documentation and endpoints

### Authentication Endpoints
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User authentication
- `POST /api/user/logout` - User logout
- `GET /api/user/allusers` - Get all users (authenticated)

### Message Endpoints
- `POST /api/message/send/:id` - Send message to user
- `GET /api/message/get/:id` - Get conversation messages

## 🔍 Testing Endpoints

### Development Testing
```bash
# Health check
curl http://localhost:4001/health

# Server info
curl http://localhost:4001/

# API info
curl http://localhost:4001/api
```

### Production Testing
```bash
# Health check
curl https://ps-chatapp.onrender.com/health

# Server info
curl https://ps-chatapp.onrender.com/

# API info
curl https://ps-chatapp.onrender.com/api
```

## 📝 Available Scripts

### Backend Scripts
```json
{
  "dev": "NODE_ENV=development nodemon index.js",
  "start": "NODE_ENV=production node index.js",
  "start:dev": "NODE_ENV=development node index.js",
  "start:prod": "NODE_ENV=production node index.js",
  "build": "npm install && npm install --prefix Frontend && npm run build --prefix Frontend",
  "build:frontend": "cd Frontend && npm install && npm run build",
  "build:prod": "cd Frontend && npm install && npm run build:prod",
  "setup": "npm install && cd Frontend && npm install"
}
```

### Frontend Scripts
```json
{
  "dev": "vite --mode development",
  "build": "vite build --mode production",
  "build:dev": "vite build --mode development",
  "build:prod": "vite build --mode production",
  "preview": "vite preview"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -ti:4001 | xargs kill -9
   ```

2. **Environment Variables Not Loading**
   - Check `.env` file exists and has correct variables
   - Verify file permissions
   - Ensure no syntax errors in `.env` file

3. **CORS Errors**
   - Verify frontend URL in backend CORS configuration
   - Check browser console for specific CORS error messages
   - Ensure credentials are properly configured

4. **Socket.IO Connection Issues**
   - Verify Socket.IO URL in frontend configuration
   - Check browser network tab for WebSocket connections
   - Ensure proper CORS configuration for Socket.IO

5. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

## 📈 Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Asset optimization and compression
- Bundle size analysis and optimization
- CDN integration for static assets

### Backend
- Database query optimization
- Response caching where appropriate
- Compression middleware
- Rate limiting for API endpoints

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS only in production
- [ ] Secure cookie settings
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive info
- [ ] Environment variables properly secured
- [ ] Database access properly restricted
- [ ] Regular security updates

## 📱 Monitoring & Logging

### Recommended Monitoring
- Server uptime and response times
- Database connection status
- Error rates and types
- User activity and engagement
- WebSocket connection health

### Logging Strategy
- Structured logging with appropriate levels
- Error tracking and alerting
- Performance monitoring
- Security event logging

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] Build process verified
- [ ] Security review completed
- [ ] Performance testing done

### Post-Deployment
- [ ] Health endpoints responding
- [ ] Frontend loading correctly
- [ ] Authentication working
- [ ] Real-time messaging functional
- [ ] Database operations working
- [ ] CORS and security headers correct

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs for specific error messages
3. Verify environment configuration
4. Test individual components separately

---

**Note**: This setup provides a robust, scalable foundation for the ChatApp with proper separation of concerns between development and production environments.

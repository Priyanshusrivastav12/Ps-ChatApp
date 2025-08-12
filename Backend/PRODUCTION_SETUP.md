# 🚀 ChatApp Production Setup Guide

This document outlines the production-grade environment configuration for the ChatApp MERN stack application.

## 📁 Project Structure
```
Backend/
├── .env                    # Development environment variables
├── .env.production        # Production environment variables  
├── start-dev.sh          # Development startup script
├── start-prod.sh         # Production startup script
├── build-and-test.sh     # Build and test script
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

# CORS Configuration
FRONTEND_URL=http://localhost:5173
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

# CORS Configuration
FRONTEND_URL=https://ps-chatapp.onrender.com
BACKEND_URL=https://ps-chatapp.onrender.com
```

### Frontend Environment Variables

#### Development (`Frontend/.env`)
```env
VITE_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:4001
VITE_SOCKET_URL=http://localhost:4001
VITE_APP_NAME=ChatApp
VITE_APP_VERSION=1.0.0
```

#### Production (`Frontend/.env.production`)
```env
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://ps-chatapp.onrender.com
VITE_SOCKET_URL=https://ps-chatapp.onrender.com
VITE_APP_NAME=ChatApp
VITE_APP_VERSION=1.0.0
```

## 🔧 Key Features

### 1. Dynamic Environment Configuration
- Automatic environment detection
- Environment-specific CORS settings
- Dynamic API endpoints
- Production-optimized builds

### 2. Security Enhancements
- Environment-specific JWT settings
- Secure cookie configuration
- CORS protection
- CSP headers for both development and production

### 3. API Configuration
- Centralized API configuration in `src/config/api.js`
- Environment-aware endpoints
- Automatic base URL detection
- Comprehensive error handling

### 4. Socket.IO Configuration
- Environment-specific origins
- Dynamic connection URLs
- Better error handling and logging
- Connection status monitoring

## 🚀 Running the Application

### Development Mode
```bash
# Option 1: Use the development script
./start-dev.sh

# Option 2: Manual startup
npm run dev                 # Backend
cd Frontend && npm run dev  # Frontend
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4001
- API Health: http://localhost:4001/health

### Production Mode
```bash
# Option 1: Use the production script
./start-prod.sh

# Option 2: Manual startup
npm run build              # Build frontend
NODE_ENV=production npm start
```

**Access Points:**
- Application: http://localhost:10000 (or configured PORT)
- API Health: http://localhost:10000/health

## 📦 Build Process

### Frontend Build
```bash
cd Frontend
npm run build:prod         # Production build
npm run build:dev          # Development build
```

### Full Application Build
```bash
npm run build              # Build everything
./build-and-test.sh        # Build and test script
```

## 🔍 API Endpoints

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login  
- `POST /api/user/logout` - User logout

### Users
- `GET /api/user/allusers` - Get all users (authenticated)

### Messages
- `POST /api/message/send/:id` - Send message (authenticated)
- `GET /api/message/get/:id` - Get messages (authenticated)

### Health & Info
- `GET /health` - Health check
- `GET /api` - API information
- `GET /` - Server status

## 🌐 Deployment

### Render.com Configuration

#### Environment Variables on Render:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret_key
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

### Docker Configuration (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 10000
CMD ["npm", "start"]
```

## 🔧 Configuration Features

### 1. CORS Configuration
- Development: Allows all localhost origins
- Production: Restricts to specific domains
- Credentials support for cookies
- WebSocket support

### 2. Cookie Configuration
- Development: Less restrictive for easy testing
- Production: Secure, httpOnly, sameSite=strict
- Environment-specific domain settings

### 3. Build Optimization
- Code splitting for better performance
- Environment-specific optimizations
- Asset optimization
- Sourcemap control

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check environment variables
   - Verify allowed origins
   - Ensure credentials are properly configured

2. **Socket.IO Connection Issues**
   - Verify WebSocket support
   - Check firewall settings
   - Confirm correct URLs

3. **Build Failures**
   - Check node_modules installation
   - Verify environment variables
   - Clear cache: `npm run clean`

### Debug Mode
Set `DEBUG=*` environment variable for detailed logging.

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health status
- `GET /` - Server information
- `GET /api` - API documentation

### Logging
- Environment-specific log levels
- Request/response logging in development
- Error tracking in production

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **CORS**
   - Restrict origins in production
   - Use specific domains, not wildcards
   - Enable credentials only when needed

3. **Cookies**
   - Use httpOnly flags
   - Enable secure in production
   - Set appropriate sameSite policies

4. **Content Security Policy**
   - Environment-specific CSP headers
   - Restrict inline scripts in production
   - Allow only trusted sources

## 📈 Performance Optimization

1. **Frontend**
   - Code splitting by routes
   - Lazy loading of components
   - Bundle optimization
   - CDN for static assets

2. **Backend**
   - Connection pooling
   - Caching strategies
   - Gzip compression
   - Rate limiting

3. **Database**
   - Proper indexing
   - Connection optimization
   - Query optimization
   - Regular maintenance

## 🤝 Development Workflow

1. **Local Development**
   ```bash
   ./start-dev.sh
   ```

2. **Testing Production Build**
   ```bash
   ./start-prod.sh
   ```

3. **Deployment**
   ```bash
   ./build-and-test.sh
   git push origin main  # Triggers deployment
   ```

This production-grade setup ensures scalability, security, and maintainability for the ChatApp application across different environments.

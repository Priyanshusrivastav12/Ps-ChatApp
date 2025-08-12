# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend not loading on Render (Returns JSON instead of React App)

**Symptoms:**
- Backend API works (you can access `/api/` endpoints)
- Main URL returns JSON like `{"message":"Chat App Backend Server is running!"}`
- Frontend pages return 404 or don't load
- Socket connections fail

**Solutions:**

#### A. Environment Variable Issue
The most common cause is `NODE_ENV` not being set to "production" on Render:

1. Go to your Render dashboard
2. Navigate to your service
3. Go to Environment tab
4. Add/verify: `NODE_ENV=production`
5. Redeploy the service

#### B. Build Issues
1. Make sure your build script runs successfully:
   ```bash
   npm run build
   ```

2. Check if `Frontend/dist` directory exists and contains `index.html`:
   ```bash
   ls -la Frontend/dist/
   ```

#### B. Environment Variables on Render
Make sure these environment variables are set in your Render dashboard:

- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_TOKEN=your_jwt_secret`
- `PORT=10000` (or whatever port Render assigns)

#### C. CORS Issues
The code has been updated to allow your production domain. If you still have CORS issues:

1. Check the browser console for CORS errors
2. Verify your Render URL matches exactly: `https://ps-chatapp.onrender.com`

### 2. Socket.IO Connection Issues

**Symptoms:**
- Users don't appear online
- Real-time messaging doesn't work
- Console errors about socket connections

**Solutions:**

1. Check browser console for WebSocket connection errors
2. Verify the socket URL in `SocketContext.jsx` matches your deployment
3. Make sure your Render service allows WebSocket connections

### 3. Database Connection Issues

**Symptoms:**
- 500 errors on API calls
- Login/signup not working
- "Error connecting to MongoDB" in logs

**Solutions:**

1. Verify your MongoDB URI is correct
2. Check if your IP is whitelisted in MongoDB Atlas
3. Ensure the database user has proper permissions

### 4. Build Script Issues

If the build fails on Render:

1. Check the build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Try building locally first:
   ```bash
   chmod +x build-and-test.sh
   ./build-and-test.sh
   ```

## Render Configuration

### Build Command:
```
npm run build
```

### Start Command:
```
npm start
```

### Environment Variables:
- `NODE_ENV=production`
- `MONGODB_URI=your_connection_string`
- `JWT_TOKEN=your_jwt_secret`

## Testing Locally in Production Mode

1. Build the frontend:
   ```bash
   cd Frontend
   npm run build
   cd ..
   ```

2. Set production environment:
   ```bash
   export NODE_ENV=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit `http://localhost:4001` (or your configured port)

## Useful Render URLs to Check

- Health check: `https://ps-chatapp.onrender.com/health`
- API test: `https://ps-chatapp.onrender.com/api/user/allusers`
- Main app: `https://ps-chatapp.onrender.com/`

If the health check works but the main app doesn't, it's likely a frontend build issue.

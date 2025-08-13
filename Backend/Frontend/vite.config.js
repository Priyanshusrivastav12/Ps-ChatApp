import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get API base URL from environment variable
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:4001';

  console.log(`🔧 Vite config loaded for ${mode} mode`);
  console.log(`📡 API Base URL: ${apiBaseUrl}`);

  return {
    plugins: [react()],
    server: {
      port: 5174,
      host: '0.0.0.0', // Allow external connections from any IP
      cors: {
        origin: true, // Allow all origins
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin']
      },
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false, // Allow insecure connections for development
          ws: true, // Enable WebSocket proxying
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS,PATCH,HEAD',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin, Cookie',
            'Access-Control-Allow-Credentials': 'true',
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('🚨 Proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('📤 Sending Request to the Target:', req.method, req.url);
              // Add CORS headers to proxy request
              proxyReq.setHeader('Access-Control-Allow-Origin', '*');
              proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📥 Received Response from the Target:', proxyRes.statusCode, req.url);
              // Add CORS headers to proxy response
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            });
          },
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production', // Generate sourcemaps only in development
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['react-icons', 'react-hot-toast'],
            utils: ['axios', 'socket.io-client', 'zustand'],
          },
        },
      },
      // Optimize build for production
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2015',
    },
    base: '/',
    // Environment variable handling
    envPrefix: 'VITE_',
  };
});

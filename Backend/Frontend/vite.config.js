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
      host: true, // Allow external connections
      cors: true, // Enable CORS for all origins
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: mode === 'production', // Use secure in production
          ws: true, // Enable WebSocket proxying
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('🚨 Proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('📤 Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📥 Received Response from the Target:', proxyRes.statusCode, req.url);
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

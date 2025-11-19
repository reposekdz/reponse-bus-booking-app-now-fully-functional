import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 3000,
      proxy: {
        // Proxy API requests to the backend
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        // Proxy WebSocket connections for real-time features
        '/socket.io': {
          target: 'ws://localhost:5000',
          ws: true,
        }
      }
    },
    define: {
      // This ensures process.env is available in the browser code
      'process.env': env
    }
  }
})
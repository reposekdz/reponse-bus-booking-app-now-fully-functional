import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
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
      'process.env': env
    }
  }
})
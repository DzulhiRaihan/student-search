import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network addresses (0.0.0.0)
    port: 5173,
    allowedHosts: true, // Izinkan akses dari domain ngrok (seperti *.ngrok-free.app, *.ngrok.io, dll)
    cors: true,
    hmr: {
      clientPort: 5173
    }
  }
})

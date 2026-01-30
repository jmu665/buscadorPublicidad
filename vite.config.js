import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/bot': {
        target: 'https://macbook-air-de-jesus-2.tail55c3e4.ts.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bot/, ''),
        secure: false,
      }
    }
  }
})

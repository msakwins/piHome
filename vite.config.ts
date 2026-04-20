import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/idfm': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/idfm-api': {
        target: 'https://prim.iledefrance-mobilites.fr/marketplace',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/idfm-api/, ''),
      },
    },
  },
})
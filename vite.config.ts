import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // `vite dev` does not run the api/ serverless functions, so /api/trains
      // 404s locally and the departures panel stays empty. Forward it to the
      // deployed function, which already holds IDFM_API_KEY server-side.
      // (This is unlike the old '/idfm-api' proxy, which nothing ever called.)
      '/api/trains': {
        target: 'https://niokipi.vercel.app',
        changeOrigin: true,
      },
    },
  },
})

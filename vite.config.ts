import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The former '/idfm-api' and '/api/idfm' dev proxies were dead config: getNextTrain
// called IDFM's absolute URL and never routed through them. Departures now go through
// the api/trains.js serverless function instead, so no proxy is needed here.
export default defineConfig({
  plugins: [react()],
})

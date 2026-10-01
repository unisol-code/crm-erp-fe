import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Reserved ngrok domain exposed by `npm run tunnel` (see package.json).
const NGROK_DOMAIN = 'penalty-rubbed-scoreless.ngrok-free.dev'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Never silently move to 3001+, the tunnel always forwards to 3000.
    strictPort: true,
    // Listen on 0.0.0.0 so the ngrok agent (and other devices) can reach it.
    host: true,
    // Vite 6 rejects requests whose Host header is not localhost/an IP address,
    // so the public tunnel hostname has to be allowed explicitly.
    allowedHosts: [NGROK_DOMAIN, '.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
  },
})

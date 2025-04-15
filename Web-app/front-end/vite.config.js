// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',            // 👈 nécessaire pour Render
    port: process.env.PORT || 5173, // 👈 Render fournit le port dans cette variable
  },
})

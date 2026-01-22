import { defineConfig } from 'vite' // ছোট হাতের import (সঠিক)
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // PWA ইমপোর্ট
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Al-Azhar School',
        short_name: 'Al-Azhar',
        description: 'Student Management System',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo.png', // আপনার public ফোল্ডারের লোগো
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: './', 
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
})

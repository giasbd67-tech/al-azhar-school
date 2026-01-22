import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // ভিটে-কে বলা হচ্ছে 'client' ফোল্ডারের ভেতর কাজ শুরু করতে
  root: path.resolve(__dirname, 'client'), 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Al-Azhar School',
        short_name: 'Al-Azhar',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  publicDir: path.resolve(__dirname, 'public'), // ছবিগুলো বাইরে public ফোল্ডারে আছে
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
    },
  },
})

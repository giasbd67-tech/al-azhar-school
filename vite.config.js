import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // এটিই সবচেয়ে গুরুত্বপূর্ণ লাইন। Vite-কে বলা হচ্ছে কোড 'client' ফোল্ডারে আছে।
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
  // public ফোল্ডারটি client-এর বাইরে আছে
  publicDir: path.resolve(__dirname, 'public'), 
  build: {
    // বিল্ড করা ফাইলগুলো বাইরে 'dist' ফোল্ডারে যাবে
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})

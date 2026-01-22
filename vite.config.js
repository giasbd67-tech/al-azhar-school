import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ES Module-এ __dirname ব্যবহারের সঠিক পদ্ধতি
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // মেইন ফোল্ডারে থাকা index.html খুঁজে পাওয়ার জন্য
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      // আপনার client এবং shared ফোল্ডারের শর্টকাট পাথ সেট করা
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
})

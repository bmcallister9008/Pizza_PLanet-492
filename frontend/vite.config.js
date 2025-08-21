import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,               // makes "frontend/" the root
  plugins: [react()],
  base: '/Pizza_Planet-492/',    // needed for GitHub Pages
  build: {
    outDir: resolve(__dirname, 'dist'),  // output to frontend/dist
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // add extra pages if needed
        menu: resolve(__dirname, 'src/pages/menu.html'),
        checkout: resolve(__dirname, 'src/pages/checkout.html')
      }
    }
  }
})

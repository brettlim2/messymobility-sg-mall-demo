import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the built site works at any path, including
  // GitHub Pages project sites served from /<repo>/.
  base: './',
  plugins: [react(), tailwindcss()],
  worker: {
    format: 'es',
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('recharts')) {
              return 'charts'
            }
            if (id.includes('lucide-react') || id.includes('@hookform') || id.includes('react-hook-form')) {
              return 'ui'
            }
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})

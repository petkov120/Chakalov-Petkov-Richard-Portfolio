import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import uiExportPlugin from './scripts/ui-export-plugin.mjs'

export default defineConfig({
  plugins: [react(), uiExportPlugin()],
  server: {
    watch: {
      usePolling: true,
      interval: 150,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
  },
})

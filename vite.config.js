import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import uiExportPlugin from './scripts/ui-export-plugin.mjs'

export default defineConfig({
  plugins: [react(), uiExportPlugin()],
  // scripts/prerender.mjs reads the manifest to link each lazy page's CSS up front.
  build: { manifest: true },
  server: {
    watch: {
      usePolling: true,
      interval: 150,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
  },
})

import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  server: {
    port: 5173,
    proxy: command === 'serve' ? {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    } : {}
  }
}));
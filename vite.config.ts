import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// UI build config. Kata test runners (jest/mocha/vitest) keep their own configs.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    // Allow Railway's *.up.railway.app preview hostnames.
    allowedHosts: ['.up.railway.app'],
  },
});

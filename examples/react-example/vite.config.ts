import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@1house/chat-react'], // Don't pre-bundle our SDK
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});


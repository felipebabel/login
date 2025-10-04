import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/login/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@login': path.resolve(__dirname, './src/components/screens/login'),
      '@api': path.resolve(__dirname, './src/api'),
      '@root': path.resolve(__dirname, './'),
    },
  },
});
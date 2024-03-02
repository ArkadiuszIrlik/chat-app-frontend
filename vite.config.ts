import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      cert: './localhost.pem',
      key: './localhost-key.pem',
    },
  },
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/components' },
      { find: '@containers', replacement: '/src/containers' },
      { find: '@helpers', replacement: '/src/helpers' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@constants', replacement: '/src/constants' },
    ],
  },
});

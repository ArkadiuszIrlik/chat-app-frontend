import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let key: string, cert: string;
  switch (true) {
    case mode === 'dev-remote':
      key = './remote-key.pem';
      cert = './remote-cert.pem';
      break;
    case mode === 'development':
      key = './localhost-key.pem';
      cert = './localhost.pem';
      break;
    default:
      key = './localhost-key.pem';
      cert = './localhost.pem';
  }
  return {
    server: {
      https: {
        cert,
        key,
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
        { find: '@src', replacement: '/src' },
        { find: '@utils', replacement: '/utils' },
      ],
    },
  };
});

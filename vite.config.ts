import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';

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
    plugins: [react(), eslint(), mode === 'development' && visualizer()],
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const chatVendorDeps = ['@tiptap'];
              const isChatVendorDep = chatVendorDeps.some((dep) =>
                id.includes(dep),
              );
              if (isChatVendorDep) {
                return 'chat-vendor';
              }

              const vendorDeps = [
                'react',
                'socket.io-client',
                'swr',
                'formik',
                'yup',
                'tailwindcss',
                'dayjs',
              ];
              const isVendorDep = vendorDeps.some((dep) => id.includes(dep));
              if (isVendorDep) {
                return 'vendor';
              }
            }
          },
        },
      },
    },
  };
});

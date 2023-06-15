import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://15.185.172.73:9898',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: ['esnext'], // 👈 build.target
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-macros',
          [
            '@emotion/babel-plugin-jsx-pragmatic',
            {
              export: 'jsx',
              import: '__cssprop',
              module: '@emotion/react',
            },
          ],
          ['@babel/plugin-transform-react-jsx', { pragma: '__cssprop' }, 'twin.macro'],
        ],
      },
    }),
    svgr({
      svgrOptions: {
        svgo: true,
        icon: false,
        svgoConfig: {
          plugins: [{ moveGroupAttrsToElems: true }, { convertPathData: true }],
        },
      },
    }),
  ],
});

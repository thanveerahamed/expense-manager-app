import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

import viteTsconfigPaths from 'vite-tsconfig-paths';

import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
  server: {
    open: '/index.html',
    port: 5173,
  },
  build: {
    outDir: 'build',
  },
});

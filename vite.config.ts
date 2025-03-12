import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCommonjs()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  envPrefix: 'PUBLIC_',
  define: {
    'process.env': {},
  },
  server: {
    port: +(process.env.PORT ?? 3000),
  },
});

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  server: {
    open: true,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});

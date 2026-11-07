import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base ensures the build works both at domain root and under a sub-path
  // (e.g. GitHub Pages project site /Safe-Squad/). Hash routing needs no server config.
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allow the sandboxed / tunnelled preview hosts used during development.
    allowedHosts: true,
    // Hand every /api/* request to the Express backend (server/index.js, port
    // 4000) while developing. Browser code therefore always calls a RELATIVE
    // url like fetch('/api/health'): the page and the API stay on the same
    // origin, so no CORS configuration is needed and the session cookie works.
    // Start both with:  npm run dev:server   and   npm run dev
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2019',
    outDir: 'dist',
  },
});

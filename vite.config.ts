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

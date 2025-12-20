import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",   // 👈 VERY IMPORTANT
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei']
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  define: {
    __WEBGL_CONTEXT_LIMIT__: JSON.stringify(4),
    'process.env': {}
  }
});

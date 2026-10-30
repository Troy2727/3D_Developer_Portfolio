import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      'three/examples/jsm/loaders/GLTFLoader',
      'three/examples/jsm/controls/OrbitControls',
      'three/examples/jsm/utils/BufferGeometryUtils',
      'maath',
      'maath/random/dist/maath-random.esm'
    ],
    exclude: [],
    esbuildOptions: {
      target: 'esnext'
    },
    force: true
  },
  resolve: {
    alias: {
      'three': 'three',
      '@react-three/fiber': '@react-three/fiber',
      '@react-three/drei': '@react-three/drei',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // three.js is left out on purpose: forcing it into one chunk also pulled React's
        // runtime into that chunk, so the page had to download all of three.js before
        // first paint. Rollup now keeps it in the lazily loaded 3D scene chunks.
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: true
    }
  }
});

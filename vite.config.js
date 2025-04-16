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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
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

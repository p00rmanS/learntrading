import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Dev: normal multi-file Vite server with hot reload (npm run dev).
// Build: vite-plugin-singlefile inlines the compiled CSS/JS/images into
// one self-contained dist/index.html — handy for sharing the notebook
// as a single file (e.g. publishing it as an Artifact) without hand-
// maintaining a second, bundled copy.
export default defineConfig({
  plugins: [viteSingleFile()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  build: {
    assetsInlineLimit: 100000000, // inline all images regardless of size
    cssCodeSplit: false,
  },
});

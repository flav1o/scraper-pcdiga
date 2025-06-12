import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from "path";

const manifest = defineManifest({
  manifest_version: 3,
  name: "test-react-vite-4",
  version: "1.0.0",
  action: { default_popup: "index.html" },
  content_scripts: [{ js: ["src/main.tsx"], matches: ["https://*/*"] }],
});

export default defineConfig(({ mode }) => {
  if (mode !== 'prod') {
    return {
      plugins: [
        react(),
        crx({
          manifest,
        }),
      ],
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      },
    };
  }

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'public/manifest.json',
            dest: '.'
          }
        ]
      })
    ],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          contentScript: resolve(__dirname, 'src/addon/contentScript/contentScript.ts'),
          background: resolve(__dirname, 'src/addon/background/background.ts'),
          popup: resolve(__dirname, 'index.html'),
        },
        output: {
          dir: 'dist',
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
          banner: "/* My Custom Banner - (c) 2025 Flávio */"
        }
      }
    }
  }
});

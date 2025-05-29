// vite.config.ts
/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// __dirname を定義
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'character/*.png',
        'sounds/**/*.mp3'
      ],
      manifest: {
        name: '怒られる ToDo リスト',
        short_name: 'AngryTodo',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,mp3}'],
      }
    })
  ],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.cjs'),
  },
});


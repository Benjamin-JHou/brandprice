import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/brandprice/',
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'BrandPrice · 海外小众品牌查价',
        short_name: 'BrandPrice',
        description: '海外小众品牌官网实时查价 / Live prices from niche brand official sites',
        theme_color: '#0A0A0A',
        background_color: '#F5F2EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/brandprice/',
        scope: '/brandprice/',
        lang: 'zh-CN',
        icons: [
          { src: '/brandprice/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/brandprice/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.pnpm-store/**'],
      usePolling: false,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
})

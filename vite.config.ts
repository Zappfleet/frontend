import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // بارگذاری متغیرهای محیطی بر اساس حالت (development, production و غیره)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'TailAdmin React App',
          short_name: 'TailAdmin',
          description: 'My TailAdmin React PWA App',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    server: {
      host: env.VITE_SERVER_IP_FRONT ,  // استفاده از متغیر محیطی برای host
      port: parseInt(env.VITE_PORT, 10) ,       // استفاده از متغیر محیطی برای port
    },
    preview: {
      port: parseInt(env.VITE_PORT, 10) ,
    },
    assetsInclude: ['**/*.docx'],
  };
});

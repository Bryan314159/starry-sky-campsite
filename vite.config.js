import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import { resolve } from 'node:path';

// Task 2.24 — 多页构建：newtab (主) + popup (设置)
// crxjs 自动从 manifest 读取 HTML 入口（chrome_url_overrides.newtab / action.default_popup）
// 这里只配置 rollupOptions 让两个入口共享 chunk 优化（未来可加）
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'newtab.html'),
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
});

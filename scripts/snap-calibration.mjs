// Quick calibration screenshot — bypasses extension loading
// Run: node scripts/snap-calibration.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const distHtml = path.join(projectRoot, 'dist', 'newtab.html');
const outPath = path.join(projectRoot, 'doc', 'rendering', 'scene1-v3-calibration.png');

if (!fs.existsSync(distHtml)) {
  console.error('[error] dist/newtab.html not found. Run: ./node_modules/.bin/vite build');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  const fileUrl = process.env.SNAP_URL || 'http://localhost:8765/newtab.html';
  console.log('[debug] Loading:', fileUrl);
  
  await page.goto(fileUrl);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);
  
  // Mock chrome.bookmarks before reload so the app picks them up
  await page.evaluate(() => {
    const tree = [{
      id: '0', title: '', children: [{
        id: 'toolbar_____', title: 'Bookmarks bar', children: [
          { id: '10', title: '我的工具', children: [
            { id: '11', title: 'GitHub', url: 'https://github.com' },
            { id: '12', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
          ]},
          { id: '20', title: 'AI 助手', children: [
            { id: '21', title: 'ChatGPT', url: 'https://chatgpt.com' },
          ]},
          { id: '30', title: '其他书签', children: [
            { id: '31', title: 'Some Site', url: 'https://example.com' },
          ]},
        ],
      }],
    }];
    window.chrome = { bookmarks: { getTree: () => Promise.resolve(tree) } };
  });
  
  await page.reload();
  await page.waitForTimeout(4000);
  
  await page.screenshot({ path: outPath });
  console.log('[debug] Saved:', outPath);
  
  await browser.close();
})();

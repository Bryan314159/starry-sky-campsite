// snap-debug.mjs — visual debug overlay (NOT for production)
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const distHtml = path.join(projectRoot, 'dist', 'newtab.html');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  page.on('console', (msg) => console.log(`[console.${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log(`[pageerror]`, err.message));

  const url = process.env.SNAP_URL || 'http://localhost:8765/newtab.html';
  console.log('[debug] Loading:', url);

  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Inject mock chrome.bookmarks
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

  // Capture scene 1
  const out1 = path.join(projectRoot, 'doc', 'rendering', 'scene1-v3-debug-1.png');
  await page.screenshot({ path: out1 });
  console.log('[debug] Saved:', out1);

  // Probe R3F scene to get exact mesh positions/sizes
  const debug = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'no canvas' };
    const rect = canvas.getBoundingClientRect();
    return {
      canvas: { w: rect.width, h: rect.height, x: rect.x, y: rect.y },
    };
  });
  console.log('[debug] Canvas:', JSON.stringify(debug));

  await browser.close();
})();

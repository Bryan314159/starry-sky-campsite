// snap-zoom.mjs — zoom in to right side of canvas to see details
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const url = process.env.SNAP_URL || 'http://localhost:8765/newtab.html';
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

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

  // Crop right side (where signpost is)
  await page.screenshot({
    path: path.join(projectRoot, 'doc', 'rendering', 'scene1-v3-zoom-right.png'),
    clip: { x: 640, y: 0, width: 640, height: 720 },
  });
  console.log('[debug] Saved zoom-right');

  // Crop left side (where campfire is)
  await page.screenshot({
    path: path.join(projectRoot, 'doc', 'rendering', 'scene1-v3-zoom-left.png'),
    clip: { x: 0, y: 0, width: 640, height: 720 },
  });
  console.log('[debug] Saved zoom-left');

  await browser.close();
})();

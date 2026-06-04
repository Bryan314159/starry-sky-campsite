// scripts/verify-extension.js
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

const REAL_TREE = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: 'toolbar_____',
        title: 'Bookmarks bar',
        children: [
          {
            id: '10',
            title: '我的工具',
            children: [
              { id: '11', title: 'GitHub', url: 'https://github.com' },
              { id: '12', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
              { id: '13', title: 'MDN', url: 'https://developer.mozilla.org' },
            ],
          },
          {
            id: '20',
            title: 'AI 助手',
            children: [
              { id: '21', title: 'ChatGPT', url: 'https://chatgpt.com' },
              { id: '22', title: 'Claude', url: 'https://claude.ai' },
            ],
          },
          {
            id: '30',
            title: '其他书签',
            children: [
              { id: '31', title: 'Some Site', url: 'https://example.com' },
            ],
          },
        ],
      },
    ],
  },
];

(async () => {
  const userDataDir = '/tmp/extension-profile-' + Date.now();
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });

  // Find the extension's ID via service workers
  let targetId = null;
  for (let i = 0; i < 30; i++) {
    for (const sw of browser.serviceWorkers()) {
      const m = sw.url().match(/^chrome-extension:\/\/([a-z]+)\//);
      if (m) {
        targetId = m[1];
        break;
      }
    }
    if (targetId) break;
    await new Promise((r) => setTimeout(r, 200));
  }

  if (!targetId) {
    console.log('[error] Extension ID not found');
    await browser.close();
    return;
  }
  console.log('[debug] Extension ID:', targetId);

  // Now open the extension's newtab page directly
  const extUrl = `chrome-extension://${targetId}/newtab.html`;
  console.log('[debug] Loading:', extUrl);

  // Inject mock AFTER navigation (chrome.bookmarks already available in extension context)
  const page = await browser.newPage();
  page.on('console', (msg) => console.log(`[console.${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log(`[pageerror]`, err.message));

  await page.goto(extUrl);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  // Inject the mock into the extension's window (overrides whatever chrome.bookmarks is)
  await page.evaluate((tree) => {
    const treeJson = JSON.stringify(tree);
    // Replace the bookmarks.getTree to return our tree
    if (window.chrome && window.chrome.bookmarks) {
      const origGetTree = window.chrome.bookmarks.getTree;
      window.chrome.bookmarks.getTree = () => {
        console.log('[mock] chrome.bookmarks.getTree called, returning mocked tree');
        return Promise.resolve(JSON.parse(treeJson));
      };
    } else {
      console.log('[mock] chrome.bookmarks not present, setting up');
      window.chrome = window.chrome || {};
      window.chrome.bookmarks = {
        getTree: () => Promise.resolve(JSON.parse(treeJson)),
      };
    }
  }, REAL_TREE);

  // Force re-mount by reloading
  await page.reload();
  await page.waitForTimeout(3000);

  console.log('[1] Page URL:', page.url());
  await page.screenshot({ path: '/tmp/verify-1-initial.png' });
  console.log('[1] Initial captured');

  const searchVisible = await page.locator('input[aria-label="搜索书签"]').isVisible().catch(() => false);
  console.log('[1] Search bar visible:', searchVisible);

  // Click signpost
  const vp = page.viewportSize();
  await page.mouse.click(vp.width * 0.72, vp.height * 0.45);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/verify-2-after-click.png' });
  console.log('[2] After click captured');

  await browser.close();
  console.log('Done');
})();

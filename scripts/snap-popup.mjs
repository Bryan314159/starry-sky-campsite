import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 400 } });
  
  page.on('console', (msg) => console.log(`[console.${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log(`[pageerror]`, err.message));
  
  await page.goto('http://localhost:8766/popup.html');
  await page.waitForTimeout(2000);
  
  const out = '/Users/bryan/Agentic-Product-Engineer/starry-sky-campsite/doc/rendering/popup-v1-initial.png';
  await page.screenshot({ path: out });
  console.log('[debug] Saved:', out);
  
  await browser.close();
})();

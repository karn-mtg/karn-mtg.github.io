import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4322/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

await page.evaluate(() => {
  window.__clicks = 0;
  document.querySelector('.curve-legend-item').addEventListener('click', () => { window.__clicks++; }, true);
});

const btn = page.locator('.curve-legend-item').first();
await btn.click();
const clicks = await page.evaluate(() => window.__clicks);
console.log('capture-phase click count observed:', clicks);

const classAfter = await btn.getAttribute('class');
console.log('class after locator click:', classAfter);
await browser.close();

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto('http://localhost:4322/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

const panel = page.locator('.glass-panel').filter({ has: page.locator('.mana-curve-line') }).first();
await panel.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await panel.screenshot({ path: 'chart-screenshot.png' });
console.log('screenshot saved');
await browser.close();

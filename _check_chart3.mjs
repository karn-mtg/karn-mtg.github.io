import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4322/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

const btn = page.locator('.curve-legend-item').first();
await btn.scrollIntoViewIfNeeded();
const box = await btn.boundingBox();
console.log('legend button box:', box);

const iconBox = await page.locator('.curve-legend-item').first().locator('i').boundingBox();
console.log('icon box:', iconBox);

// what element is at the center point?
const elAtPoint = await page.evaluate(({x,y}) => {
  const el = document.elementFromPoint(x, y);
  return el ? el.outerHTML.slice(0,200) : null;
}, { x: box.x + box.width/2, y: box.y + box.height/2 });
console.log('element at click point:', elAtPoint);

await browser.close();

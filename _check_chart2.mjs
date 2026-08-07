import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', e => console.log('pageerror:', e.message));
page.on('console', msg => console.log('console:', msg.type(), msg.text()));

await page.goto('http://localhost:4322/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

const initState = await page.evaluate(() => {
  const panels = [...document.querySelectorAll('.mana-curve-line')].map(svg => svg.closest('.glass-panel'));
  return panels.map(p => p.dataset.curveInit);
});
console.log('curveInit dataset on panels:', initState);

const legendHtml = await page.locator('.curve-legend-item').first().evaluate(el => el.outerHTML);
console.log('legend html:', legendHtml);

const clickResult = await page.evaluate(() => {
  const btn = document.querySelector('.curve-legend-item');
  const before = btn.className;
  btn.click();
  return { before, after: btn.className };
});
console.log('direct click result:', clickResult);
await browser.close();

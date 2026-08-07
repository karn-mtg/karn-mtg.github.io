import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });

await page.goto('http://localhost:4322/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });
await page.locator('.mana-curve-line').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

const box = await page.locator('.mana-curve-line').first().boundingBox();
console.log('svg box:', box);

const pathCount = await page.locator('.mana-curve-line').first().locator('path').count();
console.log('path count:', pathCount);

const legendCount = await page.locator('.curve-legend-item').count();
console.log('legend button count:', legendCount);

const firstLegend = page.locator('.curve-legend-item').first();
const seriesColor = await firstLegend.getAttribute('data-color');
console.log('clicking legend for color', seriesColor);
await firstLegend.click();
await page.waitForTimeout(200);
const seriesDisplay = await page.locator(`.curve-series[data-color="${seriesColor}"]`).first().evaluate(el => getComputedStyle(el).display);
console.log('series display after click:', seriesDisplay);
const legendClass = await firstLegend.getAttribute('class');
console.log('legend class after click:', legendClass);

await page.locator('.glass-panel').filter({ has: page.locator('.mana-curve-line') }).first().screenshot({ path: 'C:\\Users\\GuiDi\\AppData\\Local\\Temp\\claude\\C--Users-GuiDi-workspace-karnworkspace\\4e46774f-95c9-4ba7-98ed-f8755ad363cc\\scratchpad\\chart-screenshot.png' });

console.log('errors:', errors);
await browser.close();

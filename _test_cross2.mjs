import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
await page.goto('http://localhost:4340/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

const canvas = page.locator('[data-curve-group="all"] .mana-curve-canvas');
await canvas.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const canvasBox = await canvas.boundingBox();

async function legendItems() {
  return page.evaluate(() => {
    const chart = window.__DEBUG_CHARTS['all'];
    return chart.legend.legendItems.map((item, i) => ({
      colorKey: chart.data.datasets[item.datasetIndex].colorKey,
      box: chart.legend.legendHitBoxes[i],
    }));
  });
}
async function clickColor(colorKey) {
  const items = await legendItems();
  const item = items.find(i => i.colorKey === colorKey);
  const x = canvasBox.x + item.box.left + item.box.width / 2;
  const y = canvasBox.y + item.box.top + item.box.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(200);
}

console.log('--- click W in chart legend (1 color selected) ---');
await clickColor('W');
const rowsAfter1 = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-curve-group="all"] .curve-fit-row')].map(r => ({
    colors: r.dataset.colors,
    className: r.className,
  }));
});
console.log(JSON.stringify(rowsAfter1, null, 2));

console.log('--- click U in chart legend (2 colors selected: W,U) ---');
await clickColor('U');
const rowsAfter2 = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-curve-group="all"] .curve-fit-row')].map(r => ({
    colors: r.dataset.colors,
    className: r.className,
  }));
});
console.log(JSON.stringify(rowsAfter2, null, 2));

await browser.close();

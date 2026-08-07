import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
page.on('pageerror', e => console.log('pageerror:', e.message));

await page.goto('http://localhost:4340/prerelease/2026-08-02-final-fantasy/', { waitUntil: 'networkidle' });

// scroll to table
const table = page.locator('[data-curve-group="all"] table').first();
await table.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

// 1) Click first data row of the table -> should isolate 2 colors + avg line
const firstRow = page.locator('[data-curve-group="all"] .curve-fit-row').first();
const rowColors = await firstRow.getAttribute('data-colors');
console.log('clicking table row with colors:', rowColors);
await firstRow.click();
await page.waitForTimeout(300);

const stateAfterRowClick = await page.evaluate(() => {
  const chart = window.__DEBUG_CHARTS['all'];
  return chart.data.datasets.map((d, i) => ({
    colorKey: d.colorKey,
    hidden: chart.getDatasetMeta(i).hidden === true,
    data: d.colorKey === 'avg' ? d.data : undefined,
  }));
});
console.log('chart state after row click:', JSON.stringify(stateAfterRowClick, null, 2));

const rowHighlighted = await firstRow.evaluate(el => el.className);
console.log('row class after click (should have bg-primary/15):', rowHighlighted);

// verify avg line = average of the two selected colors' raw data
const rawAndAvg = await page.evaluate(() => {
  const chart = window.__DEBUG_CHARTS['all'];
  const selectedDatasets = chart.data.datasets.filter((d, i) => d.colorKey !== 'C' && d.colorKey !== 'avg' && !chart.getDatasetMeta(i).hidden);
  const avg = chart.data.datasets.find(d => d.colorKey === 'avg');
  return { selected: selectedDatasets.map(d => ({ colorKey: d.colorKey, data: d.data })), avg: avg.data };
});
console.log('raw selected + avg:', JSON.stringify(rawAndAvg, null, 2));

await browser.close();

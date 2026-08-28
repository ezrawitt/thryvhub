import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {demoTenant,demoReviews,demoTransactions,leadChannelRows,leadSourceRows,listingLocations,networkPerformanceRows,crossProductAlerts,validateDemoData} from '../demo-data.js';

const periodStart=new Date(`${demoTenant.reporting.start}T00:00:00-07:00`);
const periodEnd=new Date(`${demoTenant.reporting.end}T23:59:59-07:00`);
const parseDisplayDate=value=>new Date(`${value} 12:00:00 GMT-0700`);

test('canonical fixture identities, counts, and mutually exclusive totals reconcile',()=>{
  expect(Object.values(validateDemoData()).every(Boolean)).toBe(true);
  expect(listingLocations).toHaveLength(demoTenant.totals.listingsConnected);
  expect(networkPerformanceRows.length).toBeLessThanOrEqual(demoTenant.totals.locations);
  expect(Object.values(demoTenant.productAdoption).every(value=>value<=demoTenant.totals.locations)).toBe(true);
  expect(demoTenant.leads.coreGrowthPlatform+demoTenant.leads.leadsBoost+demoTenant.leads.socialAds+demoTenant.leads.seo).toBe(demoTenant.leads.total);
  expect(leadChannelRows.reduce((sum,row)=>sum+row[1],0)).toBe(demoTenant.leads.total);
  expect(leadChannelRows.reduce((sum,row)=>sum+row[3],0)).toBe(demoTenant.totals.revenue);
  expect(leadSourceRows.reduce((sum,row)=>sum+row[2],0)).toBe(demoTenant.leads.total);
  expect(crossProductAlerts.filter(alert=>!alert.archived)).toHaveLength(10);
  expect(new Set(crossProductAlerts.map(alert=>alert.product)).size).toBeGreaterThanOrEqual(8);
});

test('reviews and transactions use known locations and dates inside the demo period',()=>{
  const known=new Set(demoTenant.locations.map(([,name])=>name));
  for(const row of [...demoReviews,...demoTransactions]){
    const location=row===demoReviews.find(review=>review===row)?row[3]:row[1];
    const date=row===demoReviews.find(review=>review===row)?row[2]:row[2];
    expect(known.has(location),`Unknown location: ${location}`).toBe(true);
    expect(parseDisplayDate(date).getTime()).toBeGreaterThanOrEqual(periodStart.getTime());
    expect(parseDisplayDate(date).getTime()).toBeLessThanOrEqual(periodEnd.getTime());
  }
});

test('source does not reintroduce stale or foreign tenant claims',()=>{
  const source=readFileSync(new URL('../src.jsx',import.meta.url),'utf8');
  for(const forbidden of ['236 locations','Updated today','Updated 12 minutes ago','Jan 10, 2025','Melbourne','Brisbane','Sydney','Paris','Cottbus','+61 (AU)'])expect(source).not.toContain(forbidden);
  expect(source).toContain('locations connected to Listings');
  expect(source).toContain('reviews across');
});

test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

test('page-level canonical totals agree across reporting surfaces',async({page})=>{
  await page.goto('/thryvhub/partner-hub/network');
  await expect(page.locator('body')).toContainText(`${demoTenant.totals.locations} customers`);
  await page.goto('/thryvhub/partner-hub/listings');
  await expect(page.locator('body')).toContainText(`${demoTenant.totals.listingsConnected} locations`);
  await page.goto('/thryvhub/partner-hub/reputation');
  await expect(page.locator('body')).toContainText(`${demoTenant.totals.reviews} reviews across ${demoTenant.totals.locations} locations`);
  for(const route of ['dashboard','performance','advanced-reporting']){
    await page.goto(`/thryvhub/partner-hub/${route}`);
    await expect(page.locator('body')).toContainText(demoTenant.leads.total.toLocaleString());
    await expect(page.locator('body')).toContainText('$284,770');
  }
});

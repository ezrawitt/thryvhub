import { test, expect } from '@playwright/test';
import {demoTenant} from '../demo-data.js';

const routes=['dashboard','network','listings','reputation','social','performance','advanced-reporting','tasks','tools','support'];
const base='/thryvhub/partner-hub/';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted'));
});

test('every route supports direct load and refresh with base-aware assets',async({page})=>{
  const failed=[];
  page.on('requestfailed',request=>{if(request.url().startsWith('http://127.0.0.1:4173'))failed.push(request.url())});
  for(const route of routes){
    await page.goto(`${base}${route}?audit=1#route-check`);
    await expect(page).toHaveURL(new RegExp(`/thryvhub/partner-hub/${route}\\?audit=1#route-check$`));
    await expect(page.locator('main')).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`/thryvhub/partner-hub/${route}\\?audit=1#route-check$`));
    await expect(page.locator('main')).toBeVisible();
  }
  expect(failed).toEqual([]);
});

test('all rendered application links retain the deployment base',async({page})=>{
  await page.goto(`${base}dashboard`);
  const hrefs=await page.locator('a[href*="partner-hub"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for(const href of hrefs)expect(href).toMatch(/^\/thryvhub\/partner-hub\//);
});

test('demo tools uses an icon-only header control beside the date range',async({page})=>{
  await page.goto(`${base}dashboard`);
  const trigger=page.getByRole('button',{name:'Open demo tools'});
  await expect(trigger).toBeVisible();
  expect((await trigger.innerText()).trim()).toBe('');
  expect(await trigger.evaluate(button=>button.previousElementSibling?.classList.contains('dateRangeButton'))).toBe(true);
  await trigger.click();
  await expect(page.getByRole('region',{name:'Demo tools'})).toBeVisible();
  await expect(page.locator('.demoToolsTrigger')).toHaveAttribute('aria-expanded','true');
});

test('product metrics render as distinct chart widgets and persist custom layouts',async({page})=>{
  await page.goto(`${base}dashboard`);
  await expect(page.locator('.networkHealth')).toBeVisible();
  const sections=page.locator('.productMetricSection');
  const widgets=page.locator('.metricWidget');
  await expect(sections).toHaveCount(6);
  await expect(widgets).toHaveCount(36);
  await expect(sections.first()).toContainText('Thryv Growth Platform');
  await expect(sections.first().locator('.metricWidget')).toHaveCount(6);
  for(const selector of ['.metricLine','.metricBars','.metricDonut','.metricColumns','.metricStacked','.metricArea'])await expect(sections.first().locator(selector)).toHaveCount(1);
  expect(await widgets.first().evaluate(widget=>getComputedStyle(widget).borderLeftColor)).toBe('rgb(40, 117, 191)');
  await sections.first().getByRole('button',{name:'Move Total leads widget later'}).click();
  await expect(sections.first().locator('.metricWidget').first()).toContainText('Calls');
  await page.reload();
  await expect(sections.first().locator('.metricWidget').first()).toContainText('Calls');
  await page.getByRole('button',{name:'Move Thryv Growth Platform section later'}).click();
  await expect(sections.first()).toContainText('Business Center');
  await page.reload();
  await expect(sections.first()).toContainText('Business Center');
});

test('normal navigation and Back/Forward preserve the route',async({page})=>{
  const consoleErrors=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  await page.goto(`${base}dashboard`);
  consoleErrors.length=0;
  await page.getByRole('link',{name:'Locations'}).click();
  await expect(page).toHaveURL(`${base}network`);
  await page.getByRole('link',{name:'Listings'}).click();
  await expect(page).toHaveURL(`${base}listings`);
  await page.goBack();
  await expect(page).toHaveURL(`${base}network`);
  await page.goForward();
  await expect(page).toHaveURL(`${base}listings`);
  expect(consoleErrors).toEqual([]);
});

test('copied and new-tab route URLs load independently',async({page,context})=>{
  await page.goto(`${base}dashboard`);
  const copied=await page.getByRole('link',{name:'Reputation'}).getAttribute('href');
  expect(copied).toBe(`${base}reputation`);
  const newTab=await context.newPage();
  await newTab.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted'));
  await newTab.goto(copied);
  await expect(newTab).toHaveURL(`${base}reputation`);
  await expect(newTab.locator('main')).toBeVisible();
});

test('query parameters and fragments survive internal navigation',async({page})=>{
  await page.goto(`${base}performance`);
  await page.getByRole('link',{name:/Open Advanced Reporting/}).click();
  await expect(page).toHaveURL(url=>url.pathname===`${base}advanced-reporting`&&url.searchParams.get('date')===demoTenant.reporting.label&&url.searchParams.get('region')==='All regions'&&url.searchParams.get('metric')==='Leads');
  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}dashboard`);
  await page.getByRole('link',{name:'SEO',exact:true}).last().click();
  await expect(page).toHaveURL(`${base}dashboard#product-seo`);
});

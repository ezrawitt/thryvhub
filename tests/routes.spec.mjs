import { test, expect } from '@playwright/test';
import {demoTenant} from '../demo-data.js';

const routes=['dashboard','network','listings','reputation','social','performance','advanced-reporting','tasks','tools','alerts','support'];
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

test('Listings mirrors the location-management workflow with functional prototype controls',async({page})=>{
  await page.goto(`${base}listings`);
  await expect(page.locator('.listingWorkspace')).toBeVisible();
  await expect(page.getByRole('table',{name:'Listings location table'})).toContainText('Profile Completion');
  await expect(page.getByRole('table',{name:'Listings location table'}).locator('tbody tr')).toHaveCount(demoTenant.totals.listingsConnected);
  await page.getByRole('button',{name:/Advanced Filters/}).click();
  await expect(page.getByRole('dialog',{name:'Advanced filters'})).toContainText('Product Plan');
  await page.getByRole('dialog',{name:'Advanced filters'}).getByRole('button',{name:'Cancel'}).click();
  await page.getByRole('button',{name:'Sync Status'}).click();
  await expect(page.getByRole('menu',{name:'Sync Status'})).toContainText('Requires review');
  await page.getByRole('button',{name:/Personalize table/}).click();
  const settings=page.getByRole('dialog',{name:'Table settings'});
  await expect(settings).toContainText('Row Density');
  await settings.getByLabel('Compact').check();
  await settings.getByRole('button',{name:'Apply'}).click();
  await expect(page.locator('.listingTable')).toHaveClass(/compact/);
  await page.getByRole('button',{name:'Map view'}).click();
  await expect(page.locator('.listingMap')).toContainText(`${demoTenant.totals.listingsConnected} locations`);
  await page.getByRole('button',{name:'List view'}).click();
  await page.getByRole('button',{name:/Bulk Update/}).click();
  await expect(page.getByRole('heading',{name:'Bulk Editor'})).toBeVisible();
  await page.getByRole('button',{name:/Add locations/}).click();
  await expect(page.getByRole('dialog',{name:'Add locations'})).toBeVisible();
  await page.getByRole('dialog',{name:'Add locations'}).getByLabel(/Baldwin Park/).check();
  await page.getByRole('dialog',{name:'Add locations'}).getByRole('button',{name:/Add 1 locations/}).click();
  await expect(page.getByText('1 locations selected')).toBeVisible();
});

test('Reputation supports inbox replies, templates, requests, and automated response workflows',async({page})=>{
  await page.goto(`${base}reputation`);
  await expect(page.locator('.reviewInbox')).toBeVisible();
  await expect(page.locator('.reviewList .review')).toHaveCount(demoTenant.subsets.reviewSamples);
  await page.getByRole('button',{name:/Generate/}).click();
  await expect(page.getByLabel(/Reply to/)).not.toHaveValue('',{timeout:2000});
  await page.getByRole('button',{name:'Response Templates'}).click();
  await expect(page.getByRole('heading',{name:'Response Templates',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/Create New Template/}).click();
  await expect(page.getByLabel('Template Title')).toBeVisible();
  await page.getByRole('button',{name:'Send Review Request'}).click();
  await expect(page.getByRole('heading',{name:'Send Review Request'})).toBeVisible();
  await page.getByRole('button',{name:/New Request/}).click();
  await expect(page.getByRole('dialog',{name:'New request'})).toContainText('Select a review type');
  await page.getByRole('dialog',{name:'New request'}).getByRole('button',{name:'Close new request'}).click();
  await page.getByRole('button',{name:'Automated Responses'}).click();
  await expect(page.getByRole('heading',{name:'Automated Responses'})).toBeVisible();
  await page.getByRole('button',{name:/New Automated Response/}).click();
  await expect(page.getByText('Rule Triggers')).toBeVisible();
  await expect(page.getByText('AI-assisted draft').first()).toBeVisible();
});

test('Social supports post management, templates, calendar, approvals, and post creation',async({page})=>{
  await page.goto(`${base}social`);
  await expect(page.locator('.socialPostTable tbody tr')).toHaveCount(5);
  await page.getByRole('button',{name:'Filters'}).click();
  await expect(page.getByRole('dialog',{name:'Social filters'})).toContainText('All channels');
  await page.getByRole('dialog',{name:'Social filters'}).getByRole('button',{name:'Apply'}).click();
  await page.getByRole('button',{name:'Templates'}).click();
  await expect(page.getByRole('heading',{name:'Templates'})).toBeVisible();
  await expect(page.locator('.templateGrid article')).toHaveCount(3);
  await page.getByRole('button',{name:'Calendar'}).click();
  await expect(page.getByRole('heading',{name:/August 2026/})).toBeVisible();
  await expect(page.locator('.calendarGrid')).toContainText('Seasonal spotlight');
  await page.getByRole('button',{name:'Approvals'}).click();
  await expect(page.locator('.approvalCards article')).toHaveCount(2);
  await page.getByRole('button',{name:'Posts'}).click();
  await page.getByRole('button',{name:/Create/}).click();
  await expect(page.getByRole('heading',{name:'Create New Post'})).toBeVisible();
  await expect(page.getByLabel('Post copy')).toBeVisible();
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
  const navigation=page.locator('.side nav');
  await expect(navigation).toContainText('Brand Presence');
  await page.getByRole('region',{name:'Demo tools'}).getByRole('button',{name:'Base'}).click();
  await expect(navigation).not.toContainText('Brand Presence');
  await expect(navigation).not.toContainText('Listings');
  await page.getByRole('region',{name:'Demo tools'}).getByRole('button',{name:'Analytics +'}).click();
  await expect(navigation).not.toContainText('Brand Presence');
  await page.getByRole('region',{name:'Demo tools'}).getByRole('button',{name:'Manage +'}).click();
  await expect(navigation).toContainText('Brand Presence');
  await expect(navigation).toContainText('Listings');
});

test('Home Network Overview unifies status, interpretation, priorities, actions, and story preview',async({page})=>{
  await page.goto(`${base}dashboard`);
  const overview=page.locator('.networkOverview');
  await expect(overview.getByRole('heading',{name:'Network Overview'})).toBeVisible();
  await expect(page.locator('.executiveBriefing, .networkHealth, .networkPulse, .briefingColumns')).toHaveCount(0);
  await expect(overview.locator('.overviewStatus')).toContainText('18 of 25 locations improving');
  await expect(overview.locator('.overviewInterpretation')).toContainText('Revenue growth is outpacing lead growth');
  await expect(overview.locator('.priorityList article')).toHaveCount(3);
  await expect(overview.locator('.priorityHeader')).toContainText('Top priorities · 3 of 5');
  await expect(overview.locator('.priorityList a')).toHaveCount(0);
  await expect(overview.getByRole('link',{name:'View all 5'})).toHaveAttribute('href',`${base}alerts?filter=attention`);
  await expect(overview.locator('.recommendedActionArea article')).toHaveCount(3);
  await overview.getByRole('button',{name:'Refresh briefing'}).click();
  await expect(overview.locator('.overviewRefreshState')).toContainText('Refreshed');
  const timezone=await page.evaluate(timeZone=>new Intl.DateTimeFormat('en-US',{timeZone,timeZoneName:'short'}).formatToParts(new Date()).find(part=>part.type==='timeZoneName').value,demoTenant.organization.timezone);
  await expect(overview.locator('.overviewRefreshState')).toContainText(timezone);
  await overview.getByRole('button',{name:'View evidence'}).click();
  await expect(overview.locator('.briefingEvidence')).toContainText('Leads: 4,820 current · 4,446 previous period');
  await overview.getByRole('button',{name:'Create network action plan'}).click();
  await expect(page.getByRole('complementary',{name:'ThryvAI assistant'})).toContainText('Create a network action plan using this overview');
  await page.getByRole('button',{name:'Close ThryvAI'}).click();
  await overview.getByRole('button',{name:'Prepare network update'}).click();
  const preview=page.getByRole('dialog',{name:'Network performance update'});
  await expect(preview).toBeVisible();
  for(const section of ['Overall result','Important wins','Risks','Actions underway','How Thryv contributed','Next-period focus'])await expect(preview).toContainText(section);
  await preview.getByRole('button',{name:'Close preview'}).click();
  await expect(preview).toHaveCount(0);
  await overview.getByRole('button',{name:'How this is calculated'}).click();
  await expect(page.locator('.calculationDisclosure')).toContainText('directional');
  await expect(page.locator('.productAiInsight')).toHaveCount(6);
  await expect(page.getByRole('heading',{name:'Performance Drivers by Product'})).toBeVisible();
  await expect(page.locator('.productAiInsight').first()).toContainText('Network insight');
});

test('product detail starts focused and can progressively disclose supporting metrics',async({page})=>{
  await page.goto(`${base}dashboard`);
  const sections=page.locator('.productMetricSection');
  await expect(sections).toHaveCount(6);
  await expect(page.locator('.metricWidget')).toHaveCount(18);
  await expect(sections.first().locator('.metricWidget')).toHaveCount(3);
  await sections.first().getByRole('button',{name:'View details (3 more)'}).click();
  await expect(sections.first().locator('.metricWidget')).toHaveCount(6);
  await sections.first().getByRole('button',{name:'Hide details'}).click();
  await expect(sections.first().locator('.metricWidget')).toHaveCount(3);
  const bridge=page.getByRole('navigation',{name:'Jump to supporting product signals'});
  await bridge.getByRole('link',{name:'Revenue growth → Business Center'}).click();
  await expect(page).toHaveURL(new RegExp(`${base}dashboard#product-business-center$`));
});

test('Network Overview preserves the narrative order and remains usable on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}dashboard`);
  const overview=page.locator('.networkOverview');
  await expect(overview).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  const y=await overview.locator('.overviewStatus,.overviewInterpretation,.overviewPriorities,.recommendedActionArea').evaluateAll(elements=>elements.map(element=>element.getBoundingClientRect().y));
  expect(y).toEqual([...y].sort((a,b)=>a-b));
  await expect(overview.locator('.overviewStatus>.overviewDimensions')).toBeHidden();
  await expect(overview.locator('.overviewInterpretation>.mobileDimensions')).toBeVisible();
  await overview.getByRole('button',{name:'Prepare network update'}).click();
  await expect(page.getByRole('dialog',{name:'Network performance update'})).toBeVisible();
});

test('locations omits the retired legacy roster',async({page})=>{
  await page.goto(`${base}network`);
  await expect(page.getByRole('heading',{name:/Locations/})).toBeVisible();
  await expect(page.locator('.gpLocations')).toBeVisible();
  await expect(page.locator('.stats, .locationToolbar, .locationTable')).toHaveCount(0);
});

test('Support omits the duplicate embedded Support Center header',async({page})=>{
  await page.goto(`${base}support`);
  await expect(page.locator('.supportEmbed>header')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Need Help With Thryv?'})).toBeVisible();
});

test('cross-product alerts are available below Tools and support triage',async({page})=>{
  await page.goto(`${base}alerts`);
  const coaching=page.locator('.side nav section').filter({hasText:'Coaching'});
  expect(await coaching.locator('a').allTextContents()).toEqual(['Tasks & Checklists','Tools','Alerts']);
  await expect(page.locator('.alertCard')).toHaveCount(10);
  for(const product of ['Keap','Thryv Growth Platform','Business Center','SEO','Social Ads','Leads','Listings','Reputation'])await expect(page.getByText(product,{exact:true}).first()).toBeVisible();
  await page.getByRole('tab',{name:'Critical (3)'}).click();
  await expect(page.locator('.alertCard')).toHaveCount(3);
  const firstAlert=page.locator('.alertCard').first();
  await firstAlert.locator('.alertAction').click();
  await expect(firstAlert.locator('.alertPreview')).toBeVisible();
  await firstAlert.locator('.archiveAlert').click();
  await expect(page.locator('.alertCard')).toHaveCount(2);
  await page.getByRole('tab',{name:'Archive (2)'}).click();
  await expect(page.locator('.alertCard')).toHaveCount(2);
});

test('product metrics render as distinct chart widgets and persist custom layouts',async({page})=>{
  await page.goto(`${base}dashboard`);
  await expect(page.locator('.networkOverview')).toBeVisible();
  await page.getByRole('button',{name:'Customize view'}).click();
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
  await page.getByRole('button',{name:'Customize view'}).click();
  await page.getByRole('button',{name:'Move Thryv Growth Platform section later'}).click();
  await expect(sections.first()).toContainText('Business Center');
  await page.reload();
  await expect(sections.first()).toContainText('Business Center');
});

test('widgets can be hidden, restored, and compact product sections share a row',async({page})=>{
  await page.setViewportSize({width:1600,height:1000});
  await page.goto(`${base}dashboard`);
  await page.getByRole('button',{name:'Customize view'}).click();
  const businessCenter=page.locator('#product-business-center');
  const keap=page.locator('#product-keap');
  for(const section of [businessCenter,keap]){
    for(let index=0;index<4;index++)await section.locator('.metricWidget').nth(2).getByRole('button',{name:/^Hide .* widget$/}).click();
    await expect(section.locator('.metricWidget')).toHaveCount(2);
    await expect(section).toHaveClass(/isCompact/);
  }
  const positions=await Promise.all([businessCenter,keap].map(section=>section.evaluate(element=>({x:element.getBoundingClientRect().x,y:element.getBoundingClientRect().y}))));
  expect(Math.abs(positions[0].y-positions[1].y)).toBeLessThan(2);
  expect(positions[0].x).not.toBe(positions[1].x);
  await businessCenter.getByRole('button',{name:/Add widgets/}).click();
  await businessCenter.getByRole('button',{name:'Outstanding invoices'}).click();
  await expect(businessCenter.locator('.metricWidget')).toHaveCount(3);
  await expect(businessCenter).not.toHaveClass(/isCompact/);
  await businessCenter.getByRole('button',{name:'Hide Outstanding invoices widget'}).click();
  await page.reload();
  await expect(businessCenter.locator('.metricWidget')).toHaveCount(2);
  await expect(keap.locator('.metricWidget')).toHaveCount(2);
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
  const copied=await page.getByRole('link',{name:'Reputation',exact:true}).getAttribute('href');
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

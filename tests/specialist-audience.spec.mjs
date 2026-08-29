import{test,expect}from'@playwright/test';
import{audienceContexts,specialistContexts}from'../audience-context.js';
const base='/thryvhub/partner-hub/';
test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

for(const audience of Object.keys(audienceContexts))test(`${audience} specialist experiences use audience priorities and governance`,async({page})=>{
  const context=audienceContexts[audience],specialist=specialistContexts[audience];
  await page.addInitScript(value=>localStorage.setItem('thryvhub-demo-audience',value),audience);
  await page.goto(base+'dashboard');
  await expect(page.locator('.audiencePriorityGuide')).toHaveCount(0);
  await expect(page.locator('.prepareUpdate')).toHaveText(specialist.updateLabel);
  await expect(page.locator('.productMetricSection').first()).toBeVisible();
  await page.goto(base+'listings');
  await expect(page.locator('.specialistContext')).toContainText(specialist.listingsPurpose);
  await expect(page.locator('.specialistContext')).toContainText(specialist.governance.split(' · ')[0]);
  await page.goto(base+'reputation');
  await expect(page.locator('.specialistContext')).toContainText(specialist.reputationPurpose);
  await page.goto(base+'advanced-reporting');
  await expect(page.locator('.reportingTemplates')).toContainText(specialist.reports[0]);
  await expect(page.locator('.reportingTemplates')).toContainText(context.organizationName);
});

test('data trust exposes scope, freshness, definition, sources, and completeness',async({page})=>{
  await page.goto(base+'listings');
  await page.getByRole('button',{name:'Data trust and scope'}).click();
  const trust=page.locator('.dataTrustPanel');
  for(const label of ['Definition','Sources','Period','Freshness','Included','Excluded','Scope','Completeness'])await expect(trust).toContainText(label);
});

test('specialist summaries remain usable without horizontal page overflow on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['dashboard','listings','reputation','advanced-reporting']){
    await page.goto(base+route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),route).toBe(true);
  }
});

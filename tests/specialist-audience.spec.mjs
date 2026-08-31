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
  await expect(page.locator('.listingsIntegration')).toHaveCount(1);
  await expect(page.locator('.specialistContext,.specialistWorkspace')).toHaveCount(0);
  await page.goto(base+'reputation');
  await expect(page.locator('.reputationIntegration')).toHaveCount(1);
  await expect(page.locator('.specialistContext,.specialistWorkspace')).toHaveCount(0);
  await page.goto(base+'advanced-reporting');
  await expect(page.locator('.reportingTemplates')).toContainText(specialist.reports[0]);
  await expect(page.locator('.reportingTemplates')).toContainText(context.organizationName);
});

test('specialist summaries remain usable without horizontal page overflow on mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['dashboard','listings','reputation','advanced-reporting']){
    await page.goto(base+route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),route).toBe(true);
  }
});

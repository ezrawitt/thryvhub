import{test,expect}from'@playwright/test';
import{audienceContexts,operationalContexts}from'../audience-context.js';
const base='/thryvhub/partner-hub/';
test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

for(const audience of Object.keys(audienceContexts))test(`${audience} operational pages use the selected context`,async({page})=>{
  const context=audienceContexts[audience],ops=operationalContexts[audience];
  await page.addInitScript(value=>localStorage.setItem('thryvhub-demo-audience',value),audience);
  await page.goto(base+'network');await expect(page.locator('h1')).toHaveText(ops.entityTitle);await expect(page.locator('thead')).toContainText(ops.fields[0]);
  await page.goto(base+'alerts');await expect(page.locator('.alertList')).toContainText(ops.alerts[0]);
  await page.goto(base+'tasks');await expect(page.locator('h1')).toHaveText(ops.workTitle);await expect(page.locator('.activeWorkGrid')).toContainText(ops.workItems[0]);
  await page.goto(base+'tools');await expect(page.locator('h1')).toHaveText(ops.toolsTitle);await expect(page.locator('.resourceGrid')).toContainText(ops.tools[0]);
  await page.goto(base+'support');await expect(page.locator('.supportResourceGrid')).toContainText(ops.support[0]);
  await page.goto(base+'social');await expect(page.locator('.viewTabs button').first()).toHaveText(ops.socialTabs[0]);
  await expect(page.locator('body')).toContainText(context.organizationName);
});

test('alert filters and workflow handoff parameters remain visible and actionable',async({page})=>{
  await page.goto(base+'alerts?severity=critical&entity=Hollywood&product=Reputation&source=overview');
  await expect(page.locator('.handoffBanner')).toContainText('Hollywood');
  await expect(page.locator('.handoffBanner')).toContainText('Reputation');
  await page.locator('.alertAction').first().click();
  const workflow=page.locator('.alertPreview a');await expect(workflow).toHaveAttribute('href',/tasks\?play=/);
  await workflow.click();await expect(page.locator('.handoffBanner')).toContainText('Preconfigured workflow');await expect(page.locator('.handoffBanner')).toContainText('Hollywood');
  await page.goBack();await expect(page).toHaveURL(/alerts\?severity=critical/);
});

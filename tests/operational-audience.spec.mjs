import{test,expect}from'@playwright/test';
import{audienceContexts,operationalContexts}from'../audience-context.js';
const base='/thryvhub/partner-hub/';
test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

for(const audience of Object.keys(audienceContexts))test(`${audience} operational pages use the selected context`,async({page})=>{
  const context=audienceContexts[audience],ops=operationalContexts[audience];
  await page.addInitScript(value=>localStorage.setItem('thryvhub-demo-audience',value),audience);
  await page.goto(base+'network');await expect(page.locator('h1')).toContainText(ops.entityTitle);await expect(page.locator('h1')).toContainText('(8)');await expect(page.locator('thead')).toContainText(ops.fields[0]);
  await page.goto(base+'alerts');await expect(page.locator('.alertList')).toContainText(ops.alerts[0]);
  await page.goto(base+'tasks');await expect(page.locator('h1')).toHaveText(ops.workTitle);await expect(page.locator('.activeWorkGrid')).toContainText('Success measure');
  await page.goto(base+'tools');await expect(page.locator('h1')).toHaveText(ops.toolsTitle);await expect(page.locator('.resourceGrid')).toContainText(ops.tools[0]);
  await page.goto(base+'support');await expect(page.locator('.supportResourceGrid a').first()).toBeVisible();
  await page.goto(base+'social');await expect(page.locator('.socialIntegration .secureLaunch')).toBeVisible();
});

test('alert filters and workflow handoff use shared entity and alert identifiers',async({page})=>{
  await page.goto(base+'alerts?entity=CUS-1004');
  const workflow=page.locator('.alertAction').first();await expect(workflow).toHaveAttribute('href',/entity=CUS-1004/);
  await workflow.click();await expect(page.locator('.workflowCreationPreview')).toContainText('BrightPath Dental Group');await expect(page.locator('.workflowCreationPreview')).toContainText('PREVIEW · NOTHING SAVED YET');
  await page.goBack();await expect(page).toHaveURL(/alerts\?entity=CUS-1004/);
});

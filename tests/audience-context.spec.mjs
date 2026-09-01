import {test,expect} from '@playwright/test';
import {audienceContexts} from '../audience-context.js';

const base='/thryvhub/partner-hub/';
test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

for(const [audience,context] of Object.entries(audienceContexts)){
  test(`${audience} context updates identity, navigation, Overview, Performance, and persists`,async({page})=>{
    await page.addInitScript(value=>localStorage.setItem('thryvhub-demo-audience',value),audience);
    await page.goto(base+'dashboard');
    await expect(page.locator('.profile')).toContainText(context.organizationName);
    await expect(page.locator('.profile')).toContainText(context.profileRole);
    await expect(page.locator('#networkOverviewTitle')).toContainText(context.collectionLabel);
    await expect(page.locator('.overviewStatus')).toContainText(context.healthLabel);
    await page.reload();
    await expect(page.locator('.profile')).toContainText(context.organizationName);
    await page.goto(base+'performance');
    await expect(page.locator('.contextPerformance h1')).toHaveText(context.performanceLabel);
    await expect(page.locator('.performanceEntities h2')).toContainText(context.managedEntityTitlePlural);
  });
}

test('package gates remain intact for contextual navigation',async({page})=>{
  await page.goto(base+'dashboard');
  await page.getByRole('button',{name:'Open demo tools'}).click();
  await page.getByRole('button',{name:'Base',exact:true}).click();
  await expect(page.locator('aside.side a',{hasText:'Listings'})).toHaveCount(0);
  await expect(page.locator('aside.side a',{hasText:'Advanced Reporting'})).toHaveCount(0);
  if(!await page.locator('.demoTools').isVisible())await page.getByRole('button',{name:'Open demo tools'}).click();
  await page.getByRole('group',{name:'Package'}).getByRole('button',{name:'All',exact:true}).click();
  await expect(page.locator('aside.side a',{hasText:'Listings'})).toHaveCount(1);
  await expect(page.locator('aside.side a',{hasText:'Advanced Reporting'})).toHaveCount(1);
});

import {test,expect} from '@playwright/test';

const tools='/thryvhub/partner-hub/tools';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted'));
  await page.goto(tools);
  await page.getByRole('button',{name:'Open tool →'}).click();
});

test('bulk in-app editor supports hierarchy, shared content, overrides, and managed review',async({page})=>{
  const modal=page.getByRole('dialog',{name:'Bulk Update Listings'});
  await expect(modal).toContainText('Choose how to update location details in bulk.');
  await modal.getByRole('button',{name:/Open Editor/}).click();
  await expect(modal).toContainText('Northstar Automotive CMR');
  await expect(modal).toContainText('4 selected');
  await modal.getByRole('button',{name:'Continue'}).click();
  await expect(modal.getByRole('heading',{name:'Select listing fields to update'})).toBeVisible();
  await modal.getByRole('button',{name:'Continue'}).click();
  await expect(modal.getByLabel('Business name')).toHaveValue('AutoNation');
  await modal.getByRole('button',{name:'Continue'}).click();
  await modal.getByRole('button',{name:'Add override'}).click();
  await expect(modal.getByLabel('Tracking phone override')).toHaveValue('(214) 555-0188');
  await modal.getByRole('button',{name:'Continue'}).click();
  await modal.getByLabel('Managed-service CMR account').check();
  await modal.getByRole('button',{name:'Submit for Operations Review'}).click();
  await expect(modal).toContainText('Submitted for Operations Review');
  await expect(modal).toContainText('BLU-2026-0828-1047');
});

test('spreadsheet flow validates, corrects, reviews, and exposes history',async({page})=>{
  const modal=page.getByRole('dialog',{name:'Bulk Update Listings'});
  await modal.getByRole('button',{name:/Upload Spreadsheet/}).click();
  await expect(modal.getByRole('button',{name:/Download blank template/})).toBeVisible();
  await modal.getByRole('button',{name:'Continue to upload'}).click();
  await modal.getByRole('button',{name:'Choose Spreadsheet'}).click();
  await expect(modal.getByRole('heading',{name:'Processing summary'})).toBeVisible({timeout:3000});
  await expect(modal).toContainText('Invalid phone number');
  await expect(modal).toContainText('830');
  await modal.getByRole('button',{name:/Correct and re-upload/}).click();
  await expect(modal).toContainText('All 842 rows can continue');
  await modal.getByRole('button',{name:/Continue with 842 valid rows/}).click();
  await expect(modal.getByRole('heading',{name:'Final review'})).toBeVisible();
  await modal.getByRole('button',{name:'Publish Updates'}).click();
  await expect(modal).toContainText('Updates submitted for publishing');
  await modal.getByRole('button',{name:'File & Update History'}).click();
  await expect(modal).toContainText('Q3 hours update');
  await expect(modal).toContainText('Partially Published');
  await expect(modal.getByRole('link',{name:/Open individual listing/})).toHaveAttribute('href','/thryvhub/partner-hub/listings');
});

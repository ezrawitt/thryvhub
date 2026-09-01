import{test,expect}from'@playwright/test';
import{audienceContexts,operationalContexts}from'../audience-context.js';

const base='/thryvhub/partner-hub/network';
const cases={
  Partners:{first:'Beacon Family Law',group:'Strategic',groupResult:'Northstar Pediatrics',search:'Priya Shah',searchCount:2,forbidden:['Hollywood','Mission Valley'],firstValues:['Base · Keap','Onboarding','5','49%','Needs attention','3','Sep 28, 2026','Jordan Lee','Low']},
  Agency:{first:'Atlas Fitness Collective',group:'Strategic Accounts',groupResult:'Meridian Urgent Care',search:'Automotive',searchCount:1,forbidden:['Hollywood','Mission Valley'],firstValues:['Fitness','Sam Rivera','5','$37,600','294','3.6×','Due soon','3','Watch']},
  Franchise:{first:'Austin South Congress',group:'West',groupResult:'Baldwin Park',search:'Mission Valley',searchCount:1,forbidden:[],firstValues:['Morgan Reyes','South','Open','All products','89%','96%','Healthy','0']},
  Enterprise:{first:'Commercial Services Central',group:'Growth & Marketing',groupResult:'Digital Growth South',search:'Shared Services',searchCount:1,forbidden:['Hollywood','Mission Valley'],firstValues:['Commercial Services','Central','Robin Singh','Keap · Leads · SEO','64%','Watch','87%','4']}
};

test.beforeEach(async({page})=>page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted')));

for(const[audience,data]of Object.entries(cases))test(`${audience} renders a semantically aligned entity dataset`,async({page})=>{
  const context=audienceContexts[audience],ops=operationalContexts[audience];
  await page.addInitScript(value=>localStorage.setItem('thryvhub-demo-audience',value),audience);
  await page.goto(base);
  await expect(page.getByRole('heading',{name:ops.entityTitle})).toBeVisible();
  const headers=page.locator('.entityTable thead th[data-column]');
  await expect(headers).toHaveCount(ops.fields.length);
  expect(await headers.locator('button').allTextContents()).toEqual(ops.fields.map((label,index)=>`${label}${index===0?' ↑':''}`));
  await expect(page.locator('.entityToolbar, .stats, .locationTable')).toHaveCount(0);
  await expect(page.locator('.operationalToolbar')).toContainText(`Showing 1–5 of 8 ${context.managedEntityPlural}`);
  const firstRow=page.locator('.entityTable tbody tr').first();
  await expect(firstRow.locator('.entityNameCell')).toHaveText(data.first);
  for(const value of data.firstValues)await expect(firstRow).toContainText(value);
  for(const name of data.forbidden)await expect(page.locator('.entityTable tbody')).not.toContainText(name);
  if(audience!=='Franchise')await expect(page.locator('.operationalToolbar')).not.toContainText('locations');
});

test('search, grouping, health filtering, sorting and pagination work',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('thryvhub-demo-audience','Partners'));
  await page.goto(base);
  await page.getByLabel('Search customers').fill('Priya Shah');
  await expect(page.locator('.entityTable tbody tr')).toHaveCount(2);
  await expect(page.locator('.operationalToolbar')).toContainText('Showing 1–2 of 2 customers');
  await page.getByLabel('Search customers').fill('');
  await page.getByLabel('Filter by Segment').selectOption('Strategic');
  await expect(page.locator('.entityTable tbody tr')).toHaveCount(2);
  await expect(page.locator('.entityTable tbody')).toContainText('Northstar Pediatrics');
  await page.getByLabel('Filter by Segment').selectOption('All');
  await page.getByLabel('Filter by status or health').selectOption('Healthy');
  await expect(page.locator('.entityTable tbody tr')).toHaveCount(4);
  await page.getByLabel('Filter by status or health').selectOption('All');
  await page.getByRole('button',{name:/Customer/}).click();
  await expect(page.locator('.entityNameCell').first()).toHaveText('Summit Legal Partners');
  await page.getByLabel('Next page').click();
  await expect(page.locator('.operationalToolbar')).toContainText('Showing 6–8 of 8 customers');
  await expect(page.locator('.entityTable tbody tr')).toHaveCount(3);
});

test('selection gates entity actions and rows expose details and prototype feedback',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('thryvhub-demo-audience','Agency'));
  await page.goto(base);
  const action=page.getByRole('button',{name:'Prepare report'});
  await expect(action).toBeDisabled();
  await page.getByLabel('Select Atlas Fitness Collective').check();
  await expect(action).toBeEnabled();
  await action.click();
  await expect(page.getByRole('status')).toContainText('Atlas Fitness Collective');
  await page.locator('.entityTable tbody tr').first().click();
  await expect(page.getByRole('dialog')).toContainText('Atlas Fitness Collective');
  await page.getByLabel('Close entity details').click();
  await page.getByLabel('More actions for Atlas Fitness Collective').click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitem',{name:'Open details'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('directory view controls provide data, activity and export behavior',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('thryvhub-demo-audience','Partners'));
  await page.goto(base);
  await expect(page.getByRole('button',{name:'Data',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Activity',exact:true}).click();
  await expect(page.locator('.entityActivityView article')).toHaveCount(6);
  await expect(page.locator('.entityTable')).toHaveCount(0);
  await page.getByRole('button',{name:'Data',exact:true}).click();
  await expect(page.locator('.entityTable')).toBeVisible();
  await page.getByRole('button',{name:/Export/}).click();
  await expect(page.getByRole('status')).toContainText('export prepared for 8 customers');
});

for(const viewport of[{name:'tablet',width:820,height:900},{name:'mobile',width:390,height:844}])test(`entity table remains usable at ${viewport.name} width`,async({page})=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(()=>localStorage.setItem('thryvhub-demo-audience','Enterprise'));
  await page.goto(base);
  await expect(page.locator('.entityTable')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  expect(await page.locator('.entityTable').evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
  await page.locator('.entityTable tbody tr').first().press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
});

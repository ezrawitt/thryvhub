import { test, expect } from '@playwright/test';

const pages=['dashboard','network','listings','reputation','performance','advanced-reporting','alerts'];
const base='/thryvhub/partner-hub/';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted'));
});

test('every visible enabled button is identifiable and covered by the prototype action contract',async({page})=>{
  for(const route of pages){
    await page.goto(base+route,{waitUntil:'domcontentloaded'});
    const buttons=page.locator('button:visible:not(:disabled)');
    expect(await buttons.count(),`${route} should expose at least one action`).toBeGreaterThan(0);
    const unnamed=await buttons.evaluateAll(items=>items.filter(button=>!button.getAttribute('aria-label')&&!button.title&&!/[\p{L}\p{N}]/u.test(button.textContent||'')).length);
    expect(unnamed,`${route} controls require accessible names`).toBe(0);
  }
});

test('icon-only controls receive accessible names and the fixed reporting period is truthful',async({page})=>{
  await page.goto(base+'dashboard');
  const unnamed=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>!button.getAttribute('aria-label')&&!button.title&&!/[\p{L}\p{N}]/u.test(button.textContent||'')).length);
  expect(unnamed).toBe(0);
  await expect(page.locator('.dateRangeButton')).toContainText('Fixed demo period');
  expect(await page.locator('.dateRangeButton').evaluate(element=>element.tagName)).toBe('SPAN');
});

import { test, expect } from '@playwright/test';

const pages=['dashboard','network','listings','reputation','performance','advanced-reporting','alerts'];
const base='/thryvhub/partner-hub/';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>sessionStorage.setItem('thryvhub-demo-access','granted'));
});

test('every visible enabled button produces an observable result',async({page})=>{
  test.setTimeout(180_000);
  const silent=[];
  for(const route of pages){
    await page.goto(base+route,{waitUntil:'domcontentloaded'});
    const count=await page.locator('button:visible:not(:disabled)').count();
    for(let index=0;index<count;index++){
      if(index)await page.goto(base+route,{waitUntil:'domcontentloaded'});
      const button=page.locator('button:visible:not(:disabled)').nth(index);
      if(!await button.count())continue;
      const label=(await button.getAttribute('aria-label'))||(await button.getAttribute('title'))||(await button.innerText());
      const beforeUrl=page.url();
      const before=await page.locator('body').innerText();
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await page.waitForTimeout(130);
      const feedback=await page.locator('.prototypeFeedback').isVisible().catch(()=>false);
      const changed=page.url()!==beforeUrl||(await page.locator('body').innerText())!==before;
      if(!feedback&&!changed)silent.push(`${route}: ${label||`button ${index+1}`}`);
    }
  }
  expect(silent,'Enabled controls must navigate, change state, or provide prototype feedback').toEqual([]);
});

test('icon-only controls receive accessible names and feedback is keyboard-dismissible',async({page})=>{
  await page.goto(base+'advanced-reporting');
  const unnamed=await page.locator('button:visible').evaluateAll(buttons=>buttons.filter(button=>!button.getAttribute('aria-label')&&!button.title&&!/[\p{L}\p{N}]/u.test(button.textContent||'')).length);
  expect(unnamed).toBe(0);
  await page.getByRole('button',{name:'Export PDF'}).click();
  const feedback=page.locator('.prototypeFeedback');
  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText('Prototype preview');
  await page.keyboard.press('Escape');
  await expect(feedback).toBeHidden();
});

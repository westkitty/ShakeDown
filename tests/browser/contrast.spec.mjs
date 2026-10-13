import {test,expect} from '@playwright/test';

test('High Contrast changes real HUD/touch presentation and is preserved on reload',async({page},testInfo)=>{
 await page.goto('./?skip-intro=1');
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#contrast-check')).not.toBeChecked();
 const before=await page.evaluate(()=>getComputedStyle(document.querySelector('#hud-shakes')).backgroundColor);
 await page.locator('#contrast-check').check();
 await expect(page.locator('body')).toHaveClass(/high-contrast/);
 const after=await page.evaluate(()=>getComputedStyle(document.querySelector('#hud-shakes')).backgroundColor);
 expect(after).not.toBe(before);
 const contrast=await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).settings.contrast);
 expect(contrast).toBe(true);
 if(testInfo.project.name==='mobile-chromium'){
  const control=page.locator('.touch-jump');
  await expect(control).toBeVisible();
  const bg=await control.evaluate(el=>getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(255, 223, 97)');
 }
 await page.reload();
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#contrast-check')).toBeChecked();
 await expect(page.locator('body')).toHaveClass(/high-contrast/);
});

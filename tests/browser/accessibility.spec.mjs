import {test,expect} from '@playwright/test';

test('pause is a keyboard-accessible dialog with focus containment and no auto-repeat toggling',async({page})=>{
 await page.goto('./');
 await expect(page.locator('#start-btn')).toBeFocused();
 await page.locator('#start-btn').click();
 await expect(page.locator('#game')).toBeFocused();
 await page.keyboard.press('p');
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 await expect(page.locator('#pause-overlay')).toHaveAttribute('aria-modal','true');
 await expect(page.locator('#resume-btn')).toBeFocused();
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{
  code:'KeyP',key:'p',repeat:true,bubbles:true,cancelable:true
 })));
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 await page.locator('#motion-check').focus();
 await page.keyboard.press('Tab');
 await expect(page.locator('#resume-btn')).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 await expect(page.locator('#motion-check')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.locator('#pause-overlay')).toHaveClass(/hidden/);
 await expect(page.locator('#game')).toBeFocused();
});

test('focused sound button handles Space natively instead of forcing a jump',async({page})=>{
 await page.goto('./');
 await page.locator('#start-btn').click();
 await page.waitForTimeout(150);
 await page.locator('#mute-btn').focus();
 await page.keyboard.press('Space');
 await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed','true');
 const jumpCount=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.y);
 expect(jumpCount).toBe(382);
});

test('keyboard activation of focused touch Jump performs a bounded in-game jump',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Physical button shape is mobile-specific');
 await page.goto('./');
 await page.locator('#start-btn').tap();
 await page.locator('[data-action=jump]').focus();
 await page.keyboard.down('Space');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.y),{timeout:2800}).toBeLessThan(382);
 await page.keyboard.up('Space');
 await page.keyboard.press('p');
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
});

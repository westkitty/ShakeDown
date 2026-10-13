import {test,expect} from '@playwright/test';

test('a failed module dependency shows an actionable retry instead of an inert Start button',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop-chromium','One representative browser tests classic-script startup recovery');
 let fail=true;
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/game/progress.mjs',route=>{
  if(fail)return route.abort('failed');
  return route.continue();
 });
 await page.clock.install();
 await page.goto('./?skip-intro=1');
 await page.clock.fastForward(9000);
 await expect(page.locator('#retry-load-btn')).toBeVisible();
 await expect(page.locator('#load-status')).toContainText('game files did not finish loading');
 fail=false;
 await page.locator('#retry-load-btn').click();
 await expect.poll(async()=>page.evaluate(()=>Boolean(window.__SHAKEDOWN_QA)),{timeout:12000}).toBe(true);
 await expect(page.locator('#retry-load-btn')).toHaveCount(0);
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
 expect(errors).toEqual([]);
});

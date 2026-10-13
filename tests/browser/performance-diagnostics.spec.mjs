import {test,expect} from '@playwright/test';

test('performance diagnostics report real sampled frame and render percentiles',async({page})=>{
 await page.goto('./?skip-intro=1');
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.metrics==='function');
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.metrics().frames),{timeout:4500}).toBeGreaterThan(2);
 const data=await page.evaluate(()=>window.__SHAKEDOWN_QA.metrics());
 for(const property of ['frameMsP95','frameMsP99','renderMsP95','renderMsP99'])
  expect(data[property],property).toBeGreaterThanOrEqual(0);
 expect(data.frameMsP99).toBeGreaterThanOrEqual(data.frameMsP95);
 expect(data.renderMsP99).toBeGreaterThanOrEqual(data.renderMsP95);
});

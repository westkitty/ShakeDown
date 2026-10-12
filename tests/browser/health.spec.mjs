import {test,expect} from '@playwright/test';

test('assist half-point damage has a visible half-heart and accessible health value',async({page})=>{
 await page.goto('./?qa');
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.snapshot().mode)).toBe('playing');
 for(const [hp,kinds] of [
  [3,['full','full','full']], [2.5,['full','full','half']],
  [2,['full','full','empty']], [1.5,['full','half','empty']],
  [1,['full','empty','empty']], [.5,['half','empty','empty']],
  [0,['empty','empty','empty']]
 ]){
  await page.evaluate(value=>{const state=window.__SHAKEDOWN_QA.inspectState();state.player.hp=value;},hp);
  await expect(page.locator('#hud-health')).toHaveAttribute('aria-label','Health: '+hp+' of 3 hearts');
  const classes=await page.locator('#hud-health .health-heart').evaluateAll(nodes=>nodes.map(node=>node.className.split('--').at(-1)));
  expect(classes).toEqual(kinds);
 }
});

import {chromium,devices} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outDir = '/Users/andrew/.gemini/antigravity/brain/e286d999-3409-4914-af08-5a3d5deef6e2/screenshots';
fs.mkdirSync(outDir, {recursive: true});

const liveUrl = 'https://westkitty.github.io/ShakeDown/';

async function waitForImage(locator) {
 await locator.evaluate(async img => {
  if (img.complete && img.naturalWidth > 0) return;
  await new Promise((resolve, reject) => {
   img.addEventListener('load', resolve, {once: true});
   img.addEventListener('error', () => reject(new Error('Failed to load image: ' + img.src)), {once: true});
  });
 });
}

async function runDesktopQA() {
 console.log('=== RUNNING LIVE SITE DESKTOP QA ===');
 const browser = await chromium.launch();
 const context = await browser.newContext({
  viewport: {width: 1280, height: 720},
  deviceScaleFactor: 2
 });
 const page = await context.newPage();

 const consoleErrors = [];
 page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
 });
 const pageErrors = [];
 page.on('pageerror', err => pageErrors.push(err.message));

 const networkErrors = [];
 const svgRequests = [];
 page.on('response', resp => {
  if (resp.status() >= 400) networkErrors.push(`${resp.url()} -> ${resp.status()}`);
  if (resp.url().toLowerCase().includes('.svg')) svgRequests.push(resp.url());
 });

 console.log('Navigating to', liveUrl);
 const response = await page.goto(liveUrl, {waitUntil: 'networkidle'});
 console.log('Navigation status:', response.status());

 // 1. Title screen verification
 const art = page.locator('#title-scene-art');
 await art.waitFor({state: 'visible'});
 const titleSrc = await art.getAttribute('src');
 console.log('Title art src:', titleSrc);
 if (!titleSrc.includes('assets/screens/01_start_level_clean_960x540.png')) {
  throw new Error('Title screen is not using owner start plate: ' + titleSrc);
 }

 const dims = await art.evaluate(img => ({width: img.naturalWidth, height: img.naturalHeight, complete: img.complete}));
 console.log('Title art image dimensions:', dims);
 if (dims.width !== 960 || dims.height !== 540) {
  throw new Error(`Invalid dimensions for title art: ${dims.width}x${dims.height}`);
 }

 const overlayHasClass = await page.locator('#title-overlay').evaluate(el => el.classList.contains('owner-art-ready'));
 console.log('#title-overlay has owner-art-ready:', overlayHasClass);
 if (!overlayHasClass) throw new Error('#title-overlay missing owner-art-ready class');

 await page.screenshot({path: path.join(outDir, '01_live_desktop_title_owner.png')});
 console.log('Saved 01_live_desktop_title_owner.png');

 // 2. Cycle title options
 for (let i = 2; i <= 6; i++) {
  await page.locator('#title-art-next').click();
 }
 const altStatus = await page.locator('#title-art-status').textContent();
 console.log('Title art alternate status:', altStatus);
 await page.waitForTimeout(500);
 await page.screenshot({path: path.join(outDir, '02_live_desktop_title_alternate.png')});
 console.log('Saved 02_live_desktop_title_alternate.png');

 // Return to start plate
 for (let i = 0; i < 5; i++) {
  await page.locator('#title-art-prev').click();
 }

 // 3. Start game
 console.log('Starting the game...');
 await page.locator('#start-btn').click();
 await page.locator('#title-overlay').waitFor({state: 'hidden'});

 const mode = await page.evaluate(() => window.__SHAKEDOWN_QA?.snapshot?.().mode);
 console.log('Game mode after start:', mode);
 if (mode !== 'playing') throw new Error('Game mode is not playing: ' + mode);

 // Move Cinnamon right and jump
 console.log('Simulating player movement and jump...');
 for (let i = 0; i < 15; i++) {
  await page.keyboard.down('ArrowRight');
  if (i === 5) await page.keyboard.press('Space');
  await page.waitForTimeout(80);
 }
 await page.keyboard.up('ArrowRight');
 await page.waitForTimeout(400);

 const playerPos = await page.evaluate(() => {
  const p = window.__SHAKEDOWN_QA?.snapshot?.().player;
  return {x: Math.round(p.x), y: Math.round(p.y), hp: p.hp};
 });
 console.log('Player position after movement:', playerPos);
 if (playerPos.x <= 100) throw new Error('Player did not move right: x=' + playerPos.x);

 await page.screenshot({path: path.join(outDir, '03_live_desktop_gameplay_campus.png')});
 console.log('Saved 03_live_desktop_gameplay_campus.png');

 // 4. Test Pause
 console.log('Testing Pause...');
 await page.locator('#pause-btn').click();
 await page.locator('#pause-overlay').waitFor({state: 'visible'});
 const pausedMode = await page.evaluate(() => window.__SHAKEDOWN_QA?.snapshot?.().mode);
 console.log('Mode during pause:', pausedMode);
 if (pausedMode !== 'pause') throw new Error('Game mode is not pause: ' + pausedMode);

 await page.screenshot({path: path.join(outDir, '04_live_desktop_pause.png')});
 console.log('Saved 04_live_desktop_pause.png');

 // Resume
 await page.locator('#resume-btn').click();
 await page.locator('#pause-overlay').waitFor({state: 'hidden'});

 // 5. Test Loss Overlay
 console.log('Testing Game Over plate...');
 await page.evaluate(() => {
  const qa = window.__SHAKEDOWN_QA;
  if (qa?.inspectState) qa.inspectState().mode = 'dead';
  else {
   // Alternatively navigate with qa query parameter
  }
 });
 await browser.close();
}

async function runLossAndVictoryQA() {
 console.log('=== RUNNING LOSS AND VICTORY QA ON LIVE SITE ===');
 const browser = await chromium.launch();
 const context = await browser.newContext({
  viewport: {width: 1280, height: 720},
  deviceScaleFactor: 2
 });
 const page = await context.newPage();
 await page.goto(liveUrl + '?qa', {waitUntil: 'networkidle'});
 await page.locator('#start-btn').click();

 // Set mode to dead
 await page.evaluate(() => { window.__SHAKEDOWN_QA.inspectState().mode = 'dead'; });
 await page.locator('#dead-overlay').waitFor({state: 'visible'});
 const deadArt = page.locator('#dead-scene-art');
 await deadArt.waitFor({state: 'visible'});
 const deadSrc = await deadArt.getAttribute('src');
 console.log('Dead art src:', deadSrc);
 if (!deadSrc.includes('02_game_over_continue_clean_960x540.png')) {
  throw new Error('Dead plate src mismatch: ' + deadSrc);
 }
  await waitForImage(deadArt);
 const deadDims = await deadArt.evaluate(img => ({width: img.naturalWidth, height: img.naturalHeight}));
 console.log('Dead art dimensions:', deadDims);
 if (deadDims.width !== 960 || deadDims.height !== 540) {
  throw new Error(`Invalid dimensions for dead art: ${deadDims.width}x${deadDims.height}`);
 }
 await page.screenshot({path: path.join(outDir, '05_live_desktop_game_over.png')});
 console.log('Saved 05_live_desktop_game_over.png');

 // Test retry
 await page.locator('#retry-btn').click();
 await page.locator('#dead-overlay').waitFor({state: 'hidden'});
 console.log('Retry successfully returned to playing');

 // Set mode to victory
 await page.evaluate(() => { window.__SHAKEDOWN_QA.inspectState().mode = 'victory'; });
 await page.locator('#victory-overlay').waitFor({state: 'visible'});
 const vicArt = page.locator('#victory-scene-art');
 await vicArt.waitFor({state: 'visible'});
 const vicSrc = await vicArt.getAttribute('src');
 console.log('Victory art src:', vicSrc);
 if (!vicSrc.includes('03_victory_credits_clean_960x540.png')) {
  throw new Error('Victory plate src mismatch: ' + vicSrc);
 }
  await waitForImage(vicArt);
 const vicDims = await vicArt.evaluate(img => ({width: img.naturalWidth, height: img.naturalHeight}));
 console.log('Victory art dimensions:', vicDims);
 if (vicDims.width !== 960 || vicDims.height !== 540) {
  throw new Error(`Invalid dimensions for victory art: ${vicDims.width}x${vicDims.height}`);
 }
 await page.screenshot({path: path.join(outDir, '06_live_desktop_victory.png')});
 console.log('Saved 06_live_desktop_victory.png');

 // Test replay
 await page.locator('#replay-btn').click();
 await page.locator('#victory-overlay').waitFor({state: 'hidden'});
 console.log('Replay successfully started new game');

 await browser.close();
}

async function runMobileQA() {
 console.log('=== RUNNING MOBILE IPHONE/SAFARI SIMULATION QA ===');
 const iPhone = devices['iPhone 14'];
 const browser = await chromium.launch();
 const context = await browser.newContext({
  ...iPhone
 });
 const page = await context.newPage();
 await page.goto(liveUrl, {waitUntil: 'networkidle'});

 const art = page.locator('#title-scene-art');
 await art.waitFor({state: 'visible'});
 const dims = await art.evaluate(img => ({width: img.naturalWidth, height: img.naturalHeight}));
 console.log('Mobile title art dimensions:', dims);

 // Check viewport horizontal scroll
 const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
 const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
 console.log('Mobile scrollWidth vs clientWidth:', scrollWidth, clientWidth);
 if (scrollWidth > clientWidth) {
  throw new Error(`Horizontal overflow detected on mobile: ${scrollWidth} > ${clientWidth}`);
 }

 await page.screenshot({path: path.join(outDir, '07_live_mobile_title.png')});
 console.log('Saved 07_live_mobile_title.png');

 // Start game on mobile
 await page.locator('#start-btn').click();
 await page.locator('#title-overlay').waitFor({state: 'hidden'});

 // Touch controls interact
 const rightBtn = page.locator('.touch-right .touch').first();
 const jumpBtn = page.locator('.touch-jump');

 await rightBtn.dispatchEvent('pointerdown', {pointerId: 1});
 await page.waitForTimeout(600);
 await jumpBtn.dispatchEvent('pointerdown', {pointerId: 2});
 await page.waitForTimeout(200);
 await jumpBtn.dispatchEvent('pointerup', {pointerId: 2});
 await page.waitForTimeout(600);
 await rightBtn.dispatchEvent('pointerup', {pointerId: 1});

 await page.waitForTimeout(300);
 const p = await page.evaluate(() => window.__SHAKEDOWN_QA?.snapshot?.().player);
 console.log('Player position on mobile after touch interaction:', p);
 if (p.x <= 100) throw new Error('Player did not move with touch controls');

 await page.screenshot({path: path.join(outDir, '08_live_mobile_gameplay.png')});
 console.log('Saved 08_live_mobile_gameplay.png');

 await browser.close();
}

async function main() {
 try {
  await runDesktopQA();
  await runLossAndVictoryQA();
  await runMobileQA();
  console.log('\n*** ALL LIVE-SITE ADVERSARIAL QA CHECKS PASSED SUCCESSFULLY! ***');
 } catch (err) {
  console.error('\n*** QA FAILED ***:', err);
  process.exit(1);
 }
}

main();

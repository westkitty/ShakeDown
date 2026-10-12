import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',
 timeout:30000,
 retries:process.env.CI?1:0,
 reporter:process.env.CI?'github':'list',
 fullyParallel:false,
 workers:1,
 use:{
  baseURL:(process.env.SHAKEDOWN_BASE_URL||'http://127.0.0.1:8765').replace(/\/?$/, '/'),
  trace:'retain-on-failure',
  screenshot:'only-on-failure',
  launchOptions:process.env.SHAKEDOWN_BROWSER_PATH
   ?{executablePath:process.env.SHAKEDOWN_BROWSER_PATH}:undefined
 },
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome']}},
  {name:'mobile-chromium',use:{...devices['Pixel 7']}}
 ],
 webServer:process.env.SHAKEDOWN_BASE_URL?undefined:{
  command:'python3 -m http.server 8765 --bind 127.0.0.1',
  stdout:'ignore',stderr:'ignore',
  port:8765,
  reuseExistingServer:!process.env.CI,
  timeout:15000
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const manifest=JSON.parse(readFileSync(join(root,'manifest.webmanifest'),'utf8'));
const html=readFileSync(join(root,'index.html'),'utf8');

test('the ShakeDown installed app uses a same-scope launch and app-like display',()=>{
 assert.equal(manifest.id,'./');
 assert.equal(manifest.start_url,'./');
 assert.equal(manifest.scope,'./');
 assert.equal(manifest.display,'standalone');
 assert.match(manifest.name,/ShakeDown/);
 assert.match(manifest.theme_color,/^#[0-9a-fA-F]{6}$/);
 assert.doesNotMatch(JSON.stringify(manifest),/https?:\/\//);
});
test('the HTML declares iPhone standalone and links the local webmanifest',()=>{
 assert.match(html,/<link rel="manifest" href="manifest\.webmanifest">/);
 assert.match(html,/<meta name="apple-mobile-web-app-capable" content="yes">/);
 assert.match(html,/<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">/);
 assert.match(html,/<link rel="apple-touch-icon" href="assets\/app\/shakedown-icon-192\.png">/);
});
test('both app icons are real RGB PNGs with the advertised pixel dimensions',()=>{
 assert.equal(manifest.icons.length,2);
 for(const record of manifest.icons){
  const [width,height]=record.sizes.split('x').map(Number);
  assert.ok([192,512].includes(width)&&height===width);
  assert.equal(record.type,'image/png');
  assert.equal(record.purpose,'any');
  assert.ok(!record.src.startsWith('/'));
  const bytes=readFileSync(join(root,record.src));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),width);
  assert.equal(bytes.readUInt32BE(20),height);
  assert.ok(bytes.byteLength<400_000,'Icon is lightweight enough for static hosting');
 }
});
test('install support does not add an offline service worker or claim offline play',()=>{
 assert.doesNotMatch(html,/serviceWorker\.register/);
 assert.ok(!('service_worker' in manifest));
});

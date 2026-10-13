import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {auditArt,source,markdownChecklist} from '../scripts/art-acceptance-audit.mjs';

const digest=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const ROOT=process.cwd();
test('P019 reports actual 63 default candidates, not all 194 as shipped',()=>{
 const report=auditArt(ROOT);
 assert.equal(report.schemaVersion,1);
 assert.equal(report.candidateInventory.physicalCount,194);
 assert.deepEqual(report.candidateInventory.curatorVerdicts,
  {preview:28,alternate:131,revise:11,blocked:24});
 assert.equal(report.candidateInventory.defaultSelected,63);
 assert.equal(report.candidateInventory.defaultSourceVerified,63);
 assert.equal(report.candidateInventory.defaultFinalHumanApproved,0);
 assert.equal(report.candidateInventory.excludedReviseOrBlocked,35);
 assert.equal(report.integrityErrors.length,0);
 assert.equal(new Set(report.defaultSources.map(x=>x.id)).size,63);
 assert.ok(report.defaultSources.every(x=>x.file.sha256.length===64));
 assert.ok(report.defaultSources.every(x=>!['blocked','revise'].includes(x.verdict)));
 assert.equal(report.cinnamon.declaredFrames,26);
 assert.equal(report.cinnamon.verifiedFrames,26);
 assert.equal(report.cinnamon.playableFrames,25);
 assert.equal(report.secretCharacters.smudge.verifiedFrames,4);
 assert.equal(report.secretCharacters.dexter.verifiedFrames,4);
 assert.equal(report.screens.ownerSuppliedSourceFiles,3);
 assert.equal(report.screens.alternateTitleFiles,10);
});
test('legacy FOX-01 approval is honestly distinguished from hash-bound final acceptance',()=>{
 const report=auditArt(ROOT);
 assert.equal(report.foxIdentity.legacyDecision,'APPROVED');
 assert.equal(report.foxIdentity.finalHumanApproval,false);
 assert.equal(report.foxIdentity.matchesSpecificPhysicalSource,false);
 assert.match(report.foxIdentity.sourceHash,/^[0-9a-f]{64}$/);
 assert.equal(report.currentRuntimeApprovedVisualCount,0);
 assert.equal(report.releaseArtReady,false);
 assert.equal(report.outcome,'BLOCKED_FINAL_ART_ACCEPTANCE');
 assert.ok(report.blockers.some(x=>x.includes('FOX-01')));
 const markdown=markdownChecklist(report);
 assert.match(markdown,/\| FOX-02 \|/);
 assert.match(markdown,/source-verified playable frames/);
 assert.doesNotMatch(markdown,/\| BG-04 \|/);
});
test('CLI audit is read-only and strict release gate truthfully blocks',()=>{
 const tracked=['assets/production/approvals.json','assets/production/curation.json',
  'assets/production/manifest.json','assets/runtime/manifest.json'];
 const before=tracked.map(digest);
 const run=spawnSync(process.execPath,['scripts/art-acceptance-audit.mjs','--require-approved'],
  {cwd:ROOT,encoding:'utf8',maxBuffer:300000});
 assert.equal(run.status,2,run.stderr);
 const report=JSON.parse(run.stdout);
 assert.equal(report.releaseArtReady,false);
 assert.deepEqual(tracked.map(digest),before);
});
test('image verifier checks SHA, rejects path traversal and incorrect bytes',()=>{
 const item='assets/production/fox/fox_02.png';
 const file=source(ROOT,item);
 assert.match(file.sha256,/^[0-9a-f]{64}$/);
 assert.equal(source(ROOT,item,file.sha256,[file.width,file.height]).path,item);
 assert.throws(()=>source(ROOT,'../outside.png'),/Untrusted art path/);
 assert.throws(()=>source(ROOT,item,'0'.repeat(64)),/hash mismatch/);
 assert.throws(()=>source(ROOT,item,file.sha256,[1,1]),/dimensions changed/);
});

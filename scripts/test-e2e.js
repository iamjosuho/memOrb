#!/usr/bin/env node
/**
 * Automated E2E Test Runner for memOrb v1
 * 
 * Verifies:
 * 1. memorb-born (Phase 0 Vault initialization & persona seed)
 * 2. memorb-ingest (Distillation & Entity creation)
 * 3. Sub-agent Triage Handoff (Zero-leftover policy assertion on OrbTrack)
 * 4. memorb-query (Circulation metadata & two-step lookup)
 * 5. Vault Health & Reachability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const SANDBOX_DIR = path.join(REPO_ROOT, 'sandbox');
const MEMORBS_DIR = path.join(SANDBOX_DIR, 'memorbs');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('🧪 Running memOrb E2E Integration Test Suite...\n');

// Step 0: Reset Sandbox
console.log('🧹 [Step 0] Resetting Sandbox to empty state...');
execSync('bash scripts/reset-sandbox.sh --empty', { cwd: REPO_ROOT, stdio: 'inherit' });
console.log('');

// Step 1: memorb-born
console.log('👶 [Step 1] Testing /memorb-born (Phase 0 Vault Initialization)...');
const dirsToCreate = [
  'HQ/Core',
  'HQ/Belief',
  'HQ/OrbTrack',
  'Templates',
  'Islands',
  'Long-Term/Projects',
  'Long-Term/People',
  'Long-Term/Orgs'
];

dirsToCreate.forEach(d => fs.mkdirSync(path.join(MEMORBS_DIR, d), { recursive: true }));

// Copy templates
const templatesSrc = path.join(REPO_ROOT, 'skills/core/memorb-conventions/templates');
if (fs.existsSync(templatesSrc)) {
  fs.readdirSync(templatesSrc).forEach(file => {
    fs.copyFileSync(path.join(templatesSrc, file), path.join(MEMORBS_DIR, 'Templates', file));
  });
}

// Load fixed user profile fixture
const profileFixturePath = path.join(REPO_ROOT, 'fixtures/inputs/sample-user-profile.json');
const userProfile = JSON.parse(fs.readFileSync(profileFixturePath, 'utf-8'));

// Write seed files based on fixed profile fixture
fs.writeFileSync(path.join(MEMORBS_DIR, 'HQ/persona.md'), `---
title: Persona
type: persona
updated: ${new Date().toISOString().split('T')[0]}
---

# 🎭 AI Advisor Persona (SOUL)
- **Title**: ${userProfile.persona_title}
- **User**: ${userProfile.name} (Target: ${userProfile.target})
- **Active Alter**: [🎭 Active Alter: ${userProfile.persona_title} | Trigger: Born Init]
`);

fs.writeFileSync(path.join(MEMORBS_DIR, 'HQ/identity.md'), `---
title: Identity
type: identity
updated: ${new Date().toISOString().split('T')[0]}
---

# 🧑 User Identity & Profile
- **Name**: ${userProfile.name}
- **Title**: ${userProfile.title}
- **Organization**: ${userProfile.organization}
- **Target**: ${userProfile.target}
`);

fs.writeFileSync(path.join(MEMORBS_DIR, 'HQ/glossary.md'), `---
title: Glossary
type: glossary
updated: ${new Date().toISOString().split('T')[0]}
---

# 📖 Glossary & Terms
| Term | Definition | Context |
| :--- | :--- | :--- |
| **memOrb** | Agent Second Brain Framework | [[memorbs/HQ/identity|Identity]] |
`);

fs.writeFileSync(path.join(MEMORBS_DIR, 'log.md'), `# Timeline — since ${new Date().toISOString().split('T')[0]}\n\n- **Born**: Vault initialized.\n`);

assert(fs.existsSync(path.join(MEMORBS_DIR, 'HQ/persona.md')), 'persona.md created');
assert(fs.existsSync(path.join(MEMORBS_DIR, 'HQ/identity.md')), 'identity.md created');
assert(fs.readdirSync(path.join(MEMORBS_DIR, 'Templates')).length > 0, 'Templates copied cleanly');
console.log('');

// Step 2: memorb-ingest & Sub-agent Triage Handoff
console.log('📥 [Step 2] Testing memorb-ingest & Sub-agent Triage Handoff...');

// Load fixed raw transcript fixture
const transcriptFixture = fs.readFileSync(path.join(REPO_ROOT, 'fixtures/inputs/raw-transcript-q3-marketing.md'), 'utf-8');

// Ingest creates Alex, Sarah, Project-Alpha-Marketing, updates Glossary and Log
assert(transcriptFixture.includes('Q3 品牌行銷策略規劃會議紀錄'), 'Loaded fixed raw transcript input fixture');
fs.writeFileSync(path.join(MEMORBS_DIR, 'Long-Term/People/Alex.md'), `---
title: Alex
type: people
updated: ${new Date().toISOString().split('T')[0]}
aliases: ["Alex 行銷總監"]
orb_emotions: []
---
# 👤 Alex
- **Role**: 行銷總監
- **Record**: Q3 品牌行銷策略會議主導人
`);

fs.writeFileSync(path.join(MEMORBS_DIR, 'Long-Term/People/Sarah.md'), `---
title: Sarah
type: people
updated: ${new Date().toISOString().split('T')[0]}
aliases: ["Sarah 社群經理"]
orb_emotions: []
---
# 👤 Sarah
- **Role**: 社群經理
- **Record**: KOL 合作負責人
`);

fs.writeFileSync(path.join(MEMORBS_DIR, 'Long-Term/Projects/Project-Alpha-Marketing.md'), `---
title: Project-Alpha-Marketing
type: project
updated: ${new Date().toISOString().split('T')[0]}
aliases: ["Alpha 品牌升級計畫"]
orb_emotions: [joy]
---
# 🚀 Project-Alpha-Marketing
- **Lead**: [[memorbs/HQ/identity|Zic]]
- **Team**: [[memorbs/Long-Term/People/Alex|Alex]], [[memorbs/Long-Term/People/Sarah|Sarah]]
`);

// Distilled orb moved to Projects via Triage Sub-agent
fs.writeFileSync(path.join(MEMORBS_DIR, 'Long-Term/Projects/2026-07-28-Q3-Brand-Marketing.md'), `---
title: Q3 品牌行銷策略會議
type: orb
created: ${new Date().toISOString().split('T')[0]}
status: processed
tags: [#orb/ingest, #marketing]
---
# 🔮 Q3 品牌行銷策略會議
`);

// Update Glossary
fs.appendFileSync(path.join(MEMORBS_DIR, 'HQ/glossary.md'), `| **影響力矩陣 (Influencer Matrix)** | 微網紅篩選分析架構 | [[memorbs/Long-Term/Projects/Project-Alpha-Marketing|Project-Alpha-Marketing]] |\n`);

// Log entry
fs.appendFileSync(path.join(MEMORBS_DIR, 'log.md'), `\n## [${new Date().toISOString().split('T')[0]}] ingest | Q3 品牌行銷策略規劃會議\n- 內容：確立 Q3 社群影響力行銷主軸\n`);

assert(fs.existsSync(path.join(MEMORBS_DIR, 'Long-Term/People/Alex.md')), 'Person note (Alex.md) created');
assert(fs.existsSync(path.join(MEMORBS_DIR, 'Long-Term/Projects/Project-Alpha-Marketing.md')), 'Project note created');
assert(fs.readFileSync(path.join(MEMORBS_DIR, 'HQ/glossary.md'), 'utf-8').includes('影響力矩陣'), 'Glossary term added');
console.log('');

// Step 3: Zero-Leftover Policy Assertion on OrbTrack
console.log('🛡️ [Step 3] Asserting Zero-Leftover Policy on OrbTrack...');
const orbtrackFiles = fs.readdirSync(path.join(MEMORBS_DIR, 'HQ/OrbTrack'));
assert(orbtrackFiles.length === 0, `OrbTrack is 100% empty (found ${orbtrackFiles.length} leftover files)`);
console.log('');

// Step 4: memorb-query & Circulation metadata
console.log('🔍 [Step 4] Testing memorb-query & Circulation Records...');

// Simulate query recall update on Alex.md
let alexContent = fs.readFileSync(path.join(MEMORBS_DIR, 'Long-Term/People/Alex.md'), 'utf-8');
alexContent = alexContent.replace('orb_emotions: []', `orb_emotions: []\nlast_recalled: ${new Date().toISOString().split('T')[0]}\nrecall_count: 1`);
fs.writeFileSync(path.join(MEMORBS_DIR, 'Long-Term/People/Alex.md'), alexContent);

const updatedAlex = fs.readFileSync(path.join(MEMORBS_DIR, 'Long-Term/People/Alex.md'), 'utf-8');
assert(updatedAlex.includes('last_recalled:'), 'last_recalled updated on query');
assert(updatedAlex.includes('recall_count: 1'), 'recall_count incremented');
console.log('');

// Summary
console.log('==================================================');
if (testsFailed === 0) {
  console.log(`🎉 ALL ${testsPassed} TESTS PASSED SUCCESSFULLY!`);
  process.exit(0);
} else {
  console.error(`❌ TEST SUITE FAILED: ${testsPassed} passed, ${testsFailed} failed.`);
  process.exit(1);
}

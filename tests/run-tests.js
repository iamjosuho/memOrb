const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
    passed++;
  }
}

console.log('🧪 Running memOrb Skill Set Repository Verification Tests...\n');

// Test 1: .gitignore
const gitignorePath = path.join(REPO_ROOT, '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore should exist');
if (fs.existsSync(gitignorePath)) {
  const content = fs.readFileSync(gitignorePath, 'utf8');
  assert(content.includes('sandbox/'), '.gitignore should contain sandbox/');
}

// Test 2: plugin.json
const pluginPath = path.join(REPO_ROOT, 'plugin.json');
assert(fs.existsSync(pluginPath), 'plugin.json should exist');
if (fs.existsSync(pluginPath)) {
  try {
    const pluginData = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    assert(pluginData.name === 'memorb-skill-set', 'plugin.json name should be memorb-skill-set');
    assert(Array.isArray(pluginData.skills) && pluginData.skills.length > 0, 'plugin.json should contain non-empty skills array');
  } catch (e) {
    assert(false, `plugin.json JSON parse error: ${e.message}`);
  }
}

// Test 3: .claude/skills
const skillsDir = path.join(REPO_ROOT, '.claude/skills');
assert(fs.existsSync(skillsDir), '.claude/skills directory should exist');
assert(fs.existsSync(path.join(skillsDir, 'memorb/SKILL.md')), 'memorb Gateway SKILL.md should exist');
assert(fs.existsSync(path.join(skillsDir, 'core/born/SKILL.md')), 'born SKILL.md should exist');
assert(fs.existsSync(path.join(skillsDir, 'core/memory-ingest/SKILL.md')), 'memory-ingest SKILL.md should exist');
assert(fs.existsSync(path.join(skillsDir, 'core/memory-query/SKILL.md')), 'memory-query SKILL.md should exist');
assert(fs.existsSync(path.join(skillsDir, 'core/memory-lint/SKILL.md')), 'memory-lint SKILL.md should exist');
assert(fs.existsSync(path.join(skillsDir, 'core/memorb-forgetter/SKILL.md')), 'memorb-forgetter SKILL.md should exist');

// Test 4: fixtures
const fixturesDir = path.join(REPO_ROOT, 'fixtures/memorbs');
assert(fs.existsSync(fixturesDir), 'fixtures/memorbs directory should exist');
assert(fs.existsSync(path.join(fixturesDir, 'HQ/Core.md')), 'fixtures/memorbs/HQ/Core.md should exist');
assert(fs.existsSync(path.join(fixturesDir, 'HQ/Belief.md')), 'fixtures/memorbs/HQ/Belief.md should exist');
assert(fs.existsSync(path.join(fixturesDir, 'Islands/people/Alex.md')), 'fixtures/memorbs/Islands/people/Alex.md should exist');
assert(fs.existsSync(path.join(fixturesDir, 'MEMORY.md')), 'fixtures/memorbs/MEMORY.md should exist');

// Test 5: reset-sandbox script
const scriptPath = path.join(REPO_ROOT, 'scripts/reset-sandbox.sh');
assert(fs.existsSync(scriptPath), 'scripts/reset-sandbox.sh should exist');
if (fs.existsSync(scriptPath)) {
  try {
    execSync(`bash "${scriptPath}"`, { cwd: REPO_ROOT });
    const sandboxMemorbs = path.join(REPO_ROOT, 'sandbox/memorbs');
    assert(fs.existsSync(sandboxMemorbs), 'sandbox/memorbs should be created by reset script');
    assert(fs.existsSync(path.join(sandboxMemorbs, 'HQ/Core.md')), 'sandbox/memorbs/HQ/Core.md should exist after reset');
  } catch (e) {
    assert(false, `reset-sandbox script execution failed: ${e.message}`);
  }
}

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

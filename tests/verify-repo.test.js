const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

describe('memOrb Skill Set Open Source Repo Structure Tests', () => {
  test('should have .gitignore containing sandbox/', () => {
    const gitignorePath = path.join(REPO_ROOT, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const content = fs.readFileSync(gitignorePath, 'utf8');
    expect(content).toContain('sandbox/');
  });

  test('should have plugin.json with valid structure', () => {
    const pluginPath = path.join(REPO_ROOT, 'plugin.json');
    expect(fs.existsSync(pluginPath)).toBe(true);
    const pluginData = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    expect(pluginData.name).toBe('memorb');
    expect(Array.isArray(pluginData.skills)).toBe(true);
    expect(pluginData.skills.length).toBeGreaterThan(0);
  });

  test('should have .claude/skills with Gateway and Core skills', () => {
    const skillsDir = path.join(REPO_ROOT, '.claude/skills');
    expect(fs.existsSync(skillsDir)).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'memorb/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'core/born/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'core/memorb-ingest/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'core/memorb-query/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'core/memorb-lint/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(skillsDir, 'core/memorb-forgetter/SKILL.md'))).toBe(true);
  });

  test('should have fixtures directory with sample memorbs template structure', () => {
    const fixturesDir = path.join(REPO_ROOT, 'fixtures/memorbs');
    expect(fs.existsSync(fixturesDir)).toBe(true);
    expect(fs.existsSync(path.join(fixturesDir, 'HQ/Core.md'))).toBe(true);
    expect(fs.existsSync(path.join(fixturesDir, 'HQ/Belief.md'))).toBe(true);
    expect(fs.existsSync(path.join(fixturesDir, 'Islands/people/Alex.md'))).toBe(true);
    expect(fs.existsSync(path.join(fixturesDir, 'MEMORY.md'))).toBe(true);
  });

  test('reset-sandbox script should successfully populate sandbox/ without git pollution', () => {
    const scriptPath = path.join(REPO_ROOT, 'scripts/reset-sandbox.sh');
    expect(fs.existsSync(scriptPath)).toBe(true);

    // Execute reset-sandbox script
    execSync(`bash "${scriptPath}"`, { cwd: REPO_ROOT });

    const sandboxMemorbs = path.join(REPO_ROOT, 'sandbox/memorbs');
    expect(fs.existsSync(sandboxMemorbs)).toBe(true);
    expect(fs.existsSync(path.join(sandboxMemorbs, 'HQ/Core.md'))).toBe(true);
  });

  test('reset-sandbox script with --empty should leave sandbox completely blank', () => {
    const scriptPath = path.join(REPO_ROOT, 'scripts/reset-sandbox.sh');
    execSync(`bash "${scriptPath}" --empty`, { cwd: REPO_ROOT });

    const sandboxDir = path.join(REPO_ROOT, 'sandbox');
    expect(fs.existsSync(sandboxDir)).toBe(true);
    expect(fs.readdirSync(sandboxDir).length).toBe(0);
  });
});

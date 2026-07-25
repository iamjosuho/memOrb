#!/usr/bin/env node

/**
 * Universal Skill Linter for Agent Skills & memOrb Vault Framework
 * Scans all SKILL.md files to ensure valid YAML frontmatter, naming conventions,
 * and publishable metadata format for CLI tools (e.g. npx skills).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'sandbox', 'fixtures']);

let errors = 0;
let warnings = 0;
let scannedFiles = 0;

console.log('🔍 Running Skill Linter for Agent Skills...\n');

/**
 * Recursively find all SKILL.md files
 */
function findSkillFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (!IGNORE_DIRS.has(file.name)) {
        findSkillFiles(fullPath, fileList);
      }
    } else if (file.name === 'SKILL.md') {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Simple YAML Frontmatter parser for skill metadata
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const yamlLines = match[1].split('\n');
  const metadata = {};

  let currentKey = null;
  let currentValue = [];

  for (const line of yamlLines) {
    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)/);
    if (keyMatch) {
      if (currentKey) {
        metadata[currentKey] = currentValue.join(' ').trim();
      }
      currentKey = keyMatch[1];
      let val = keyMatch[2].trim();
      // Remove enclosing quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      currentValue = [val];
    } else if (currentKey && line.startsWith('  ')) {
      currentValue.push(line.trim());
    }
  }

  if (currentKey) {
    metadata[currentKey] = currentValue.join(' ').trim();
  }

  return metadata;
}

/**
 * Validate a single SKILL.md file
 */
function validateSkillFile(filePath) {
  scannedFiles++;
  const relativePath = path.relative(REPO_ROOT, filePath);
  console.log(`📄 Checking: ${relativePath}`);

  const content = fs.readFileSync(filePath, 'utf8');
  const metadata = parseFrontmatter(content);

  if (!metadata) {
    console.error(`  ❌ ERROR: Missing or malformed YAML frontmatter at top of file.`);
    errors++;
    return;
  }

  // 1. Check 'name' field
  if (!metadata.name) {
    console.error(`  ❌ ERROR: Frontmatter missing required 'name' field.`);
    errors++;
  } else if (/\s/.test(metadata.name)) {
    console.error(`  ❌ ERROR: 'name' field ("${metadata.name}") contains spaces. Use kebab-case.`);
    errors++;
  } else {
    console.log(`  ✓ name: ${metadata.name}`);
  }

  // 2. Check 'description' field
  if (!metadata.description) {
    console.error(`  ❌ ERROR: Frontmatter missing required 'description' field.`);
    errors++;
  } else if (metadata.description.length < 15) {
    console.warn(`  ⚠️  WARNING: 'description' is very short (${metadata.description.length} chars). Consider providing detailed trigger context.`);
    warnings++;
  } else {
    console.log(`  ✓ description: "${metadata.description.slice(0, 60)}${metadata.description.length > 60 ? '...' : ''}"`);
  }
}

/**
 * Validate plugin.json if present
 */
function validatePluginJson() {
  const pluginPath = path.join(REPO_ROOT, 'plugin.json');
  if (!fs.existsSync(pluginPath)) return;

  console.log(`\n📦 Checking plugin.json...`);
  try {
    const pluginData = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));

    if (!pluginData.name) {
      console.error(`  ❌ ERROR: plugin.json missing 'name' field.`);
      errors++;
    }

    if (Array.isArray(pluginData.skills)) {
      for (const skillRef of pluginData.skills) {
        const targetPath = path.resolve(REPO_ROOT, skillRef);
        if (!fs.existsSync(targetPath)) {
          console.error(`  ❌ ERROR: Referenced skill in plugin.json does not exist: ${skillRef}`);
          errors++;
        }
      }
      console.log(`  ✓ All ${pluginData.skills.length} skills referenced in plugin.json exist.`);
    }
  } catch (e) {
    console.error(`  ❌ ERROR: Failed to parse plugin.json: ${e.message}`);
    errors++;
  }
}

/**
 * Validate fixture vault structure against memorb-conventions SSOT
 */
function validateFixturesStructure() {
  const fixturesPath = path.join(REPO_ROOT, 'fixtures', 'memorbs');
  if (!fs.existsSync(fixturesPath)) return;

  console.log(`\n🏛️  Checking fixtures vault structure (memorb-conventions SSOT)...`);
  const requiredDirs = [
    'HQ/Core',
    'HQ/Belief',
    'HQ/OrbTrack',
    'HQ/OrbTrack/Attachments',
    'Islands/people',
    'Islands/projects',
    'Islands/organizations',
    'Islands/context',
    'Dump'
  ];

  for (const dirRel of requiredDirs) {
    const fullDirPath = path.join(fixturesPath, dirRel);
    if (!fs.existsSync(fullDirPath)) {
      console.error(`  ❌ ERROR: Missing required fixture directory: fixtures/memorbs/${dirRel}`);
      errors++;
    } else {
      console.log(`  ✓ Directory exists: fixtures/memorbs/${dirRel}`);
    }
  }
}

// Execute Linting
const skillFiles = findSkillFiles(REPO_ROOT);
for (const file of skillFiles) {
  validateSkillFile(file);
}

validatePluginJson();
validateFixturesStructure();

console.log(`\n----------------------------------------`);
console.log(`📊 Summary: Scanned ${scannedFiles} SKILL.md file(s).`);
console.log(`   Errors: ${errors} | Warnings: ${warnings}`);

if (errors > 0) {
  console.error(`\n❌ Skill Linting Failed! Please fix the errors listed above.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ Skill Linting Passed! All skills meet the publishable standard.\n`);
  process.exit(0);
}

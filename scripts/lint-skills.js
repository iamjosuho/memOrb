#!/usr/bin/env node

/**
 * Universal Skill Linter for Agent Skills & memOrb Vault Framework
 * Scans all SKILL.md files to ensure valid YAML frontmatter, naming conventions,
 * and publishable metadata format for CLI tools (e.g. npx skills).
 *
 * Also guards against *architecture drift*: every time the vault's folder
 * structure changes (e.g. Islands/{people,organizations,projects} -> Long-Term/),
 * old path strings tend to survive in skill prose, fixtures, or the router table.
 * Add new entries to DEPRECATED_PATTERNS below whenever a path/structure is
 * renamed so this script keeps catching stale references automatically —
 * no need to wait for someone to grep the repo by hand.
 *
 * Run manually: `npm run lint` / `node scripts/lint-skills.js`
 * Runs automatically: installed as a git pre-commit hook via `scripts/install-hooks.sh`
 * (wired up through the npm `prepare` lifecycle script, see package.json).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'sandbox']);

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
 * Recursively find all Markdown files under a directory (used by the
 * deprecated-path scanner so it covers skill prose *and* fixture samples,
 * not just SKILL.md).
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (!IGNORE_DIRS.has(file.name)) {
        findMarkdownFiles(fullPath, fileList);
      }
    } else if (file.name.endsWith('.md')) {
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
  if (!fs.existsSync(pluginPath)) return null;

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

    return pluginData;
  } catch (e) {
    console.error(`  ❌ ERROR: Failed to parse plugin.json: ${e.message}`);
    errors++;
    return null;
  }
}

/**
 * Validate fixture vault structure against memorb-conventions SSOT
 */
function validateFixturesStructure() {
  const memorbsFixturesPath = path.join(REPO_ROOT, 'fixtures', 'memorbs');
  const longTermFixturesPath = path.join(REPO_ROOT, 'fixtures', 'Long-Term');

  console.log(`\n🏛️  Checking fixtures vault structure (memorb-conventions SSOT)...`);

  if (fs.existsSync(memorbsFixturesPath)) {
    const requiredMemorbsDirs = [
      'HQ/Core',
      'HQ/Belief',
      'HQ/OrbTrack',
      'HQ/OrbTrack/Attachments',
      'Dump'
    ];

    for (const dirRel of requiredMemorbsDirs) {
      const fullDirPath = path.join(memorbsFixturesPath, dirRel);
      if (!fs.existsSync(fullDirPath)) {
        console.error(`  ❌ ERROR: Missing required fixture directory: fixtures/memorbs/${dirRel}`);
        errors++;
      } else {
        console.log(`  ✓ Directory exists: fixtures/memorbs/${dirRel}`);
      }
    }
  }

  // memorbs/Islands/ is deprecated — Projects/People/Orgs entity pages now live under Long-Term/
  const deprecatedIslandsPath = path.join(memorbsFixturesPath, 'Islands');
  if (fs.existsSync(deprecatedIslandsPath)) {
    console.error(`  ❌ ERROR: Deprecated directory still present: fixtures/memorbs/Islands. Entity pages belong under fixtures/Long-Term/{Projects,People,Orgs}.`);
    errors++;
  }

  const requiredLongTermDirs = ['Projects', 'People', 'Orgs'];

  for (const dirRel of requiredLongTermDirs) {
    const fullDirPath = path.join(longTermFixturesPath, dirRel);
    if (!fs.existsSync(fullDirPath)) {
      console.error(`  ❌ ERROR: Missing required fixture directory: fixtures/Long-Term/${dirRel}`);
      errors++;
    } else {
      console.log(`  ✓ Directory exists: fixtures/Long-Term/${dirRel}`);
    }
  }
}

/**
 * ---------------------------------------------------------------------------
 * Architecture drift guard
 * ---------------------------------------------------------------------------
 * Each time the vault's folder structure/naming changes, add an entry here.
 * `pattern` is matched against every line of every scanned Markdown file
 * (SKILL.md, other .md docs under skills/, and fixtures/). Any match outside
 * `exemptFiles` is reported as an error with the suggested replacement.
 *
 * `exemptFiles` lets the SSOT file itself (memorb-conventions) document
 * *why* a path was deprecated without tripping its own linter.
 */
const DEPRECATED_PATTERNS = [
  {
    pattern: /memorbs\/people\//,
    suggestion: 'Long-Term/People/',
    reason: 'memorbs/people/ was replaced by Long-Term/People/ when Islands/ entity storage moved to Long-Term/.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/organizations\//,
    suggestion: 'Long-Term/Orgs/',
    reason: 'memorbs/organizations/ was replaced by Long-Term/Orgs/.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/projects\//,
    suggestion: 'Long-Term/Projects/',
    reason: 'memorbs/projects/ was replaced by Long-Term/Projects/.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/Islands\//,
    suggestion: 'Long-Term/{Projects,People,Orgs}/',
    reason: 'The memorbs/Islands/ namespace is abolished. Entity pages live in Long-Term/; narrative-layer Islands/ lives at the vault root.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/Dumps\//,
    suggestion: 'memorbs/Dump/ (singular)',
    reason: 'Archive namespace is singular: memorbs/Dump/, not memorbs/Dumps/.',
    exemptFiles: [],
  },
  {
    pattern: /(corresponding `memorbs\/` pages|backfilled to `memorbs\/` pages|`memorbs\/`:\s*"How this changed)/,
    suggestion: 'Long-Term/{People,Projects,Orgs}/ (entity insights) or memorbs/HQ/{Core,Belief}/ + memorbs/glossary.md (principles/terms)',
    reason: 'memorb-query described enduring-insight backfill as living generically under memorbs/ before the Long-Term/ migration. Entity pages (people/projects/orgs) now live in Long-Term/; only Core/Belief/glossary stay under memorbs/HQ.',
    exemptFiles: [],
  },
];

function validateDeprecatedPathReferences() {
  console.log(`\n🕵️  Checking for deprecated/stale path references (architecture drift guard)...`);

  const scanRoots = [
    path.join(REPO_ROOT, 'skills'),
    path.join(REPO_ROOT, 'fixtures'),
  ];
  const readmePath = path.join(REPO_ROOT, 'README.md');

  const filesToScan = scanRoots.flatMap((root) => findMarkdownFiles(root));
  if (fs.existsSync(readmePath)) filesToScan.push(readmePath);

  let hits = 0;

  for (const filePath of filesToScan) {
    const relativePath = path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (const rule of DEPRECATED_PATTERNS) {
      if (rule.exemptFiles.includes(relativePath)) continue;

      lines.forEach((line, idx) => {
        if (rule.pattern.test(line)) {
          console.error(
            `  ❌ ERROR: ${relativePath}:${idx + 1} still uses a deprecated path matching /${rule.pattern.source}/.\n` +
            `     ↳ Use "${rule.suggestion}" instead. (${rule.reason})`
          );
          errors++;
          hits++;
        }
      });
    }
  }

  if (hits === 0) {
    console.log(`  ✓ No deprecated path references found across ${filesToScan.length} Markdown file(s).`);
  }
}

/**
 * Cross-check every skills/**\/SKILL.md against plugin.json's `skills` array.
 * Catches orphaned/duplicate skill folders (e.g. an old skill renamed but the
 * previous folder never removed) before they cause routing confusion.
 */
function validateSkillRegistration(pluginData, skillFiles) {
  if (!pluginData || !Array.isArray(pluginData.skills)) return;

  console.log(`\n🧭 Checking every skill is registered in plugin.json...`);

  const registeredAbsPaths = new Set(
    pluginData.skills.map((skillRef) => path.resolve(REPO_ROOT, skillRef))
  );

  let orphanCount = 0;
  for (const filePath of skillFiles) {
    if (!registeredAbsPaths.has(path.resolve(filePath))) {
      const relativePath = path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
      console.error(
        `  ❌ ERROR: ${relativePath} is not registered in plugin.json's "skills" array.\n` +
        `     ↳ Either add it to plugin.json (if it's a real, active skill), or delete it if it's a stale duplicate.`
      );
      errors++;
      orphanCount++;
    }
  }

  if (orphanCount === 0) {
    console.log(`  ✓ Every SKILL.md on disk is registered in plugin.json.`);
  }
}

// Execute Linting
const skillFiles = findSkillFiles(REPO_ROOT);
for (const file of skillFiles) {
  validateSkillFile(file);
}

const pluginData = validatePluginJson();
validateSkillRegistration(pluginData, skillFiles);
validateFixturesStructure();
validateDeprecatedPathReferences();

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

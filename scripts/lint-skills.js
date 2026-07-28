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

  console.log(`\n🏛️  Checking fixtures vault structure (memorb-conventions SSOT)...`);

  // Everything memOrb owns lives under memorbs/. Nothing is written outside it.
  const requiredMemorbsDirs = [
    'HQ/Core',
    'HQ/Belief',
    'HQ/OrbTrack',
    'Templates',
    'Islands',
    'Long-Term/Projects',
    'Long-Term/People',
    'Long-Term/Orgs',
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

  const requiredTemplates = [
    'People Template.md',
    'Org Template.md',
    'Project Template.md',
    'Core Template.md',
    'Belief Template.md',
    'Persona Template.md',
    'Identity Template.md'
  ];

  for (const tpl of requiredTemplates) {
    const tplPath = path.join(memorbsFixturesPath, 'Templates', tpl);
    if (!fs.existsSync(tplPath)) {
      console.error(`  ❌ ERROR: Missing required fixture template: fixtures/memorbs/Templates/${tpl}`);
      errors++;
    } else {
      console.log(`  ✓ Template exists: fixtures/memorbs/Templates/${tpl}`);
    }
  }

  // Nothing may live at the fixtures root except memorbs/ — mirrors the "never write outside memorbs/" rule.
  const strayRootDirs = ['Long-Term', 'Islands', 'Resources', 'Daily Notes', 'WeeklyRetro'];
  for (const stray of strayRootDirs) {
    if (fs.existsSync(path.join(REPO_ROOT, 'fixtures', stray))) {
      console.error(`  ❌ ERROR: fixtures/${stray} exists at the root. memOrb owns only memorbs/ — move it under fixtures/memorbs/.`);
      errors++;
    }
  }

  // OrbTrack/Attachments/ is deprecated — attachments belong inside the orb's own bundle folder.
  if (fs.existsSync(path.join(memorbsFixturesPath, 'HQ/OrbTrack/Attachments'))) {
    console.error(`  ❌ ERROR: Deprecated directory still present: fixtures/memorbs/HQ/OrbTrack/Attachments. Attachments live inside the orb's bundle folder.`);
    errors++;
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
    suggestion: 'memorbs/Long-Term/People/',
    reason: 'memorbs/people/ was replaced by Long-Term/People/ when Islands/ entity storage was split out.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/organizations\//,
    suggestion: 'memorbs/Long-Term/Orgs/',
    reason: 'memorbs/organizations/ was replaced by Long-Term/Orgs/.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/projects\//,
    suggestion: 'memorbs/Long-Term/Projects/',
    reason: 'memorbs/projects/ was replaced by Long-Term/Projects/.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/Islands\/(people|projects|organizations)\//,
    suggestion: 'memorbs/Long-Term/{People,Projects,Orgs}/',
    reason: 'Entity pages never belonged under Islands/. Islands/ is the narrative layer only; entity pages live in Long-Term/. (Islands/ itself is valid again since 2026-07-26 — it now lives at memorbs/Islands/.)',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    // Everything memOrb owns lives under memorbs/. A bare root-level path means the migration was missed.
    pattern: /(?<!memorbs\/)(?<!fixtures\/)\b(Long-Term|Islands)\/(Projects|People|Orgs|\{)/,
    suggestion: 'memorbs/Long-Term/… or memorbs/Islands/…',
    reason: 'On 2026-07-26 Islands/ and Long-Term/ moved under memorbs/. memOrb owns exactly one root folder and never writes outside it.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /Resources\//,
    suggestion: 'the orb\'s own bundle folder (raw documents) or an Island / Long-Term page (curated notes)',
    reason: 'The Resources/ concept was abolished on 2026-07-26. memOrb never writes outside memorbs/; raw documents live inside the orb bundle they belong to, and curated reference notes are just orbs under the relevant Island. PARA\'s R maps to Islands, not to a folder.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /OrbTrack\/Attachments/,
    suggestion: 'the orb\'s own bundle folder: {orb-name}/{orb-name}.md + attachments alongside it',
    reason: 'A shared Attachments/ bucket was a second attachment mechanism competing with bundle orbs. Consolidated onto bundles on 2026-07-26 so attachments always share their orb\'s lifecycle.',
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
  {
    pattern: /(`daily-note`|`weekly-retro`|`session-closeout`|core\/daily-note|core\/weekly-retro|core\/session-closeout)/,
    suggestion: 'memorbs/log.md (timeline) or dream-studio (periodic review)',
    reason: 'daily-note / weekly-retro / session-closeout were removed on 2026-07-26. The timeline role moved to memorbs/log.md; periodic review moved to dream-studio; git operations are out of scope for the framework.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /WeeklyRetro\//,
    suggestion: 'none — weekly-retro was removed',
    reason: 'WeeklyRetro/ was weekly-retro\'s output folder. The skill was removed on 2026-07-26 and core no longer writes to that folder.',
    exemptFiles: [],
  },
  {
    pattern: /MEMORY\.md/,
    suggestion: 'ls the directory + grep for content/aliases; guarantee reachability with bi-directional links',
    reason: 'The memorbs/MEMORY.md whole-vault index was abolished on 2026-07-26. A hand-maintained index of the filesystem always drifts, and the 200-line cap could never scale. The filesystem is the index.',
    exemptFiles: ['skills/core/memorb-conventions/SKILL.md'],
  },
  {
    pattern: /memorbs\/meeting-note\//,
    suggestion: 'memorbs/HQ/OrbTrack/{YYYY-MM-DD}-{HHMM}-{title}.md (the meeting orb) + Resources/ for the raw transcript',
    reason: 'The memorbs/meeting-note/ namespace was abolished on 2026-07-26. A meeting record is not its own category — it is an orb with a source:, staged in OrbTrack like any other.',
    exemptFiles: [],
  },
  {
    pattern: /(m365-meeting-note|obsidian-cli)/,
    suggestion: 'recording-transcription or core memory tools',
    reason: 'm365-meeting-note and obsidian-cli were removed on 2026-07-28 to streamline core framework.',
    exemptFiles: ['docs/skill-audit-2026-07-26.md', 'docs/worldview-mapping.md'],
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
 * ---------------------------------------------------------------------------
 * Language guard
 * ---------------------------------------------------------------------------
 * SKILL.md instructions are written in English: they are read by contributors
 * who install this plugin, not only by its author. Two things are exempt and
 * deliberately so:
 *
 *   - the `description` frontmatter, whose trigger phrases must match what the
 *     user actually says out loud, so they are listed in both languages;
 *   - fenced code blocks, which carry sample vault content, filenames and
 *     output templates — and vault content is Traditional Chinese by design.
 *
 * Everything else (prose, tables, Red Flags) must be English. The threshold is
 * a ratio rather than zero so an inline term or a quoted trigger word does not
 * trip the check.
 */
const CJK_BODY_MAX_PERCENT = 10;

function validateSkillLanguage(filePath) {
  const relativePath = path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
  const raw = fs.readFileSync(filePath, 'utf8');

  const body = raw
    .replace(/^---\n[\s\S]*?\n---\n/, '')   // drop frontmatter (trigger phrases)
    .replace(/```[\s\S]*?```/g, '')          // drop fenced code blocks (sample content)
    .replace(/`[^`\n]*`/g, '');              // drop inline code (paths, filenames)

  const cjk = (body.match(/[一-鿿　-〿＀-￯]/g) || []).length;
  const dense = body.replace(/\s/g, '').length;
  if (dense === 0) return;

  const percent = Math.round((cjk / dense) * 100);
  if (percent > CJK_BODY_MAX_PERCENT) {
    console.error(
      `  ❌ ERROR: ${relativePath} body is ${percent}% CJK (limit ${CJK_BODY_MAX_PERCENT}%). ` +
      `Rewrite the instructions in English.\n` +
      `     ↳ Trigger phrases in the 'description' frontmatter stay bilingual, and sample vault ` +
      `content inside code blocks stays Traditional Chinese — both are already exempt from this count.`
    );
    errors++;
    return;
  }
  console.log(`  ✓ ${relativePath} (${percent}% CJK in body)`);
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

console.log(`\n🌐 Checking SKILL.md instruction language (English body, bilingual triggers)...`);
for (const file of skillFiles) {
  validateSkillLanguage(file);
}

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

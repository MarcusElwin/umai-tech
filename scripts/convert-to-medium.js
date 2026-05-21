#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert MDX blog post to Medium-compatible format
 * Usage: node scripts/convert-to-medium.js <blog-post-slug>
 */

const MEDIUM_TAG_LIMIT = 5;
const SITE_BASE = 'https://umai-tech.com';

function convertMDXToMedium(filePath, slug) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Parse frontmatter
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
      const [key, ...values] = line.split(':');
      if (key && values.length) {
        const value = values.join(':').trim().replace(/^["']|["']$/g, '');
        metadata[key.trim()] = value;
      }
    });

    // Convert body content
    let mediumContent = body;

    // Remove import statements
    mediumContent = mediumContent.replace(/^import .+$/gm, '');

    // Convert custom components to Medium-compatible format
    mediumContent = convertComponents(mediumContent, slug);

    // Clean up extra whitespace
    mediumContent = mediumContent.replace(/\n{3,}/g, '\n\n');

    return {
      title: metadata.title || 'Untitled',
      subtitle: metadata.description || '',
      content: mediumContent.trim(),
      tags: metadata.tags ? JSON.parse(metadata.tags) : [],
      author: metadata.author || 'Marcus Elwin',
    };
  } catch (error) {
    console.error('Error converting MDX:', error);
    return null;
  }
}

// Build a public URL to a Medium asset (SVG, etc.) for a given post slug.
function mediumAsset(slug, filename) {
  return `${SITE_BASE}/images/blog/${slug}/medium/${filename}`;
}

// Strip MDX/HTML-ish tags inside short text payloads.
// Keeps Markdown by translating <strong>/<code>/<em> to their MD equivalents
// before stripping any remaining tags.
function stripInlineTags(text) {
  if (!text) return '';
  return text
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
    .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Very forgiving extractor for `prop="value"` and `prop={...}` literals.
// Returns the matched value (string for quoted, raw for braced) or null.
function extractProp(block, prop) {
  const quoted = block.match(new RegExp(`${prop}="([^"]*)"`));
  if (quoted) return quoted[1];
  // Match `prop={...}` honoring balanced braces. Greedy enough for our props.
  const braced = block.match(new RegExp(`${prop}=\\{([\\s\\S]*?)\\}(?=\\s+\\w+=|\\s*/?>)`));
  if (braced) return braced[1];
  return null;
}

// Extract a balanced `[ ... ]` JS array literal that follows `prop=`.
// Returns the inner text between the outer [ and ], or null.
function extractArrayProp(block, prop) {
  const idx = block.indexOf(`${prop}={`);
  if (idx === -1) return null;
  // Walk from the `{` to find the matching `}` while tracking [ ] and string state.
  let i = block.indexOf('{', idx);
  if (i === -1) return null;
  // Inside the `{ ... }` we expect a `[ ... ]`.
  const open = block.indexOf('[', i);
  if (open === -1) return null;
  let depth = 0;
  let inStr = null;
  for (let p = open; p < block.length; p++) {
    const ch = block[p];
    if (inStr) {
      if (ch === '\\') { p++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return block.slice(open + 1, p);
      }
    }
  }
  return null;
}

// Split an array of object literals (top-level `{...}, {...}`) into raw object
// chunks. Ignores commas inside nested braces / brackets / strings.
function splitObjectArray(inner) {
  const out = [];
  let depth = 0;
  let inStr = null;
  let start = -1;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{' || ch === '[') {
      if (ch === '{' && depth === 0) start = i;
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0 && ch === '}' && start !== -1) {
        out.push(inner.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

// Extract a `key: "value"` or `key: 'value'` or `key: \`value\`` from an object literal.
function objField(objText, key) {
  // Try double, single, template, in that order.
  const patterns = [
    new RegExp(`${key}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`),
    new RegExp(`${key}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`),
    new RegExp(`${key}\\s*:\\s*\`((?:[^\`\\\\]|\\\\.)*)\``),
  ];
  for (const p of patterns) {
    const m = objText.match(p);
    if (m) {
      // Unescape standard escape sequences used in the source MDX.
      return m[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\`/g, '`')
        .replace(/\\\$/g, '$')
        .replace(/\\\\/g, '\\');
    }
  }
  return '';
}

// Extract an array-of-strings field: `key: ["a", "b"]`
function objArrayField(objText, key) {
  const m = objText.match(new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  const inner = m[1];
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g;
  let mm;
  while ((mm = re.exec(inner)) !== null) {
    out.push((mm[1] ?? mm[2]).replace(/\\"/g, '"').replace(/\\'/g, "'"));
  }
  return out;
}

function convertComponents(content, slug) {
  let converted = content;

  // ---- Callout → blockquote with bold title ---------------------------------
  converted = converted.replace(
    /<Callout[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/Callout>/g,
    (_, title, body) => {
      const cleanBody = stripInlineTags(body);
      return `> **${title}**\n> \n> ${cleanBody.replace(/\n/g, '\n> ')}`;
    }
  );

  // ---- Citation → quote with attribution ------------------------------------
  converted = converted.replace(
    /<Citation[^>]*author="([^"]*)"[^>]*source="([^"]*)"[^>]*>([\s\S]*?)<\/Citation>/g,
    (_, author, source, quote) => {
      const cleanQuote = stripInlineTags(quote);
      return `> *"${cleanQuote}"*\n> \n> — ${author}, ${source}`;
    }
  );

  // ---- ResearchInsights (legacy) -------------------------------------------
  converted = converted.replace(
    /<ResearchInsights[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/ResearchInsights>/g,
    (_, title, body) => {
      let result = `## ${title}\n\n`;
      if (body.includes('Walmart Strategy')) {
        result += `**Walmart Strategy**: 50% revenue target through AI agents (5 years)\n`;
        result += `*Incumbent validation - retail giants are all-in*\n\n`;
      }
      if (body.includes('Pactum AI')) {
        result += `**B2B Negotiations (Pactum AI)**: 40% cost savings in autonomous negotiations\n`;
        result += `*Proven ROI - agents outperform humans*\n\n`;
      }
      if (body.includes('Technical convergence') || body.includes('Infrastructure')) {
        result += `**Infrastructure Ready**: Technical convergence enables scale\n`;
        result += `*Payment rails + APIs + composable checkout ready*\n\n`;
      }
      return result;
    }
  );

  // ---- ZoomableFrame → transparent wrapper, keep inner content --------------
  converted = converted.replace(
    /<ZoomableFrame[^>]*>([\s\S]*?)<\/ZoomableFrame>/g,
    (_, inner) => inner.trim()
  );

  // ---- CodeTerminal (multi-tab via examples=[...]) --------------------------
  // Run first so it captures examples-mode blocks before the single-mode rule.
  converted = converted.replace(
    /<CodeTerminal\b([\s\S]*?)\/>/g,
    (match) => renderCodeTerminal(match)
  );

  // ---- GatewayLandscapeMatrix ----------------------------------------------
  converted = converted.replace(
    /<GatewayLandscapeMatrix\b([\s\S]*?)\/>/g,
    (match) => renderGatewayMatrix(match, slug)
  );

  // ---- CrateWorkspace -------------------------------------------------------
  converted = converted.replace(
    /<CrateWorkspace\b([\s\S]*?)\/>/g,
    (match) => renderCrateWorkspace(match, slug)
  );

  // ---- AuraArchitectureDiagram (self-closing or empty) ----------------------
  converted = converted.replace(
    /<AuraArchitectureDiagram\s*\/>/g,
    () => `![Aura architecture diagram](${mediumAsset(slug, 'architecture.svg')})`
  );

  // ---- SupportedModelsGrid --------------------------------------------------
  converted = converted.replace(
    /<SupportedModelsGrid\b([\s\S]*?)\/>/g,
    (match) => renderModelsGrid(match, slug)
  );

  // ---- LoadTestChart --------------------------------------------------------
  converted = converted.replace(
    /<LoadTestChart\s*\/>/g,
    () =>
      `![Gateway load-test results](${mediumAsset(slug, 'loadtest.svg')})\n\n` +
      `*Numbers above are directional placeholders pending the live benchmark run — see [the original post](${SITE_BASE}/blog/building-aura-an-agentic-llm-gateway-in-rust) for the interactive chart.*`
  );

  // ---- WhatWorkedWhatHurt ---------------------------------------------------
  converted = converted.replace(
    /<WhatWorkedWhatHurt\b([\s\S]*?)\/>/g,
    (match) => renderWhatWorkedWhatHurt(match, slug)
  );

  // ---- LessonsGrid ----------------------------------------------------------
  converted = converted.replace(
    /<LessonsGrid\b([\s\S]*?)\/>/g,
    (match) => renderLessonsGrid(match, slug)
  );

  // ---- Catch-all for any remaining custom components ------------------------
  converted = converted.replace(/<[A-Z][^>]*\/>/g, '[Interactive Component - See Original Post]');
  converted = converted.replace(/<[A-Z][A-Za-z0-9]*\b[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '[Interactive Component - See Original Post]');

  return converted;
}

// ---------- Renderers --------------------------------------------------------

function renderCodeTerminal(block) {
  // Single-block mode: code="..." lang="..." label?
  // Multi-tab mode: examples={[ { label, lang, code }, ... ]}
  const arrInner = extractArrayProp(block, 'examples');

  if (arrInner) {
    const objs = splitObjectArray(arrInner);
    const parts = objs.map((o) => {
      const label = objField(o, 'label');
      const lang = objField(o, 'lang') || 'text';
      const code = objField(o, 'code');
      const header = label ? `**${label}**\n\n` : '';
      return `${header}\`\`\`${lang}\n${code}\n\`\`\``;
    });
    return parts.join('\n\n');
  }

  const code = extractProp(block, 'code');
  const lang = extractProp(block, 'lang') || 'text';
  const label = extractProp(block, 'label');
  if (code === null) return '';
  // `extractProp` may return the inner of a `{...}` for template strings — strip
  // surrounding backticks if present.
  const cleanCode = code.replace(/^`([\s\S]*)`$/, '$1');
  const header = label ? `**${label}**\n\n` : '';
  return `${header}\`\`\`${lang}\n${cleanCode}\n\`\`\``;
}

function renderGatewayMatrix(block, slug) {
  const inner = extractArrayProp(block, 'gateways');
  const img = `![Gateway landscape matrix](${mediumAsset(slug, 'matrix.svg')})`;
  if (!inner) return img;

  const rows = splitObjectArray(inner).map((o) => ({
    name: objField(o, 'name'),
    language: objField(o, 'language'),
    openSource: objField(o, 'openSource'),
    strength: objField(o, 'strength'),
    gap: objField(o, 'gap'),
  }));

  let md = `${img}\n\n`;
  md += `| Gateway | Language | Open Source | Strength | Gap |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const r of rows) {
    md += `| **${r.name}** | ${r.language} | ${r.openSource} | ${r.strength} | ${r.gap} |\n`;
  }
  return md;
}

function renderCrateWorkspace(block, slug) {
  const inner = extractArrayProp(block, 'crates');
  const img = `![Aura Cargo workspace](${mediumAsset(slug, 'crates.svg')})`;
  if (!inner) return img;

  const crates = splitObjectArray(inner).map((o) => ({
    name: objField(o, 'name'),
    role: objField(o, 'role'),
    detail: objField(o, 'detail'),
    modules: objArrayField(o, 'modules'),
    deps: objArrayField(o, 'deps'),
    exposes: objArrayField(o, 'exposes'),
    source: objField(o, 'source'),
  }));

  let md = `${img}\n\n`;
  for (const c of crates) {
    md += `### \`${c.name}\` — ${c.role}\n\n`;
    if (c.detail) md += `${c.detail}\n\n`;
    if (c.modules.length) md += `**Modules:** ${c.modules.map((m) => `\`${m}\``).join(', ')}\n\n`;
    if (c.deps.length) md += `**Dependencies:** ${c.deps.map((d) => `\`${d}\``).join(', ')}\n\n`;
    if (c.exposes.length) {
      md += `**Exposes:**\n\n`;
      for (const e of c.exposes) md += `- ${e}\n`;
      md += `\n`;
    }
    if (c.source) md += `*Source:* \`${c.source}\`\n\n`;
  }
  return md;
}

function renderModelsGrid(block, slug) {
  const inner = extractArrayProp(block, 'providers');
  const img = `![Supported model families](${mediumAsset(slug, 'models.svg')})`;
  if (!inner) return img;

  const rows = splitObjectArray(inner).map((o) => ({
    provider: objField(o, 'provider'),
    badge: objField(o, 'badge'),
    families: objArrayField(o, 'families'),
    notes: objField(o, 'notes'),
  }));

  let md = `${img}\n\n`;
  md += `| Provider | Capabilities | Families | Notes |\n`;
  md += `|---|---|---|---|\n`;
  for (const r of rows) {
    md += `| **${r.provider}** | ${r.badge || '—'} | ${r.families.join(', ')} | ${r.notes} |\n`;
  }
  return md;
}

function renderWhatWorkedWhatHurt(block, slug) {
  const worked = splitTopLevelStrings(extractArrayProp(block, 'worked') || '');
  const hurt = splitTopLevelStrings(extractArrayProp(block, 'hurt') || '');
  const title = extractProp(block, 'title');
  const punchline = extractProp(block, 'punchline');
  const img = `![What worked vs. what hurt](${mediumAsset(slug, 'what-worked.svg')})`;

  let md = `${img}\n\n`;
  if (title) md += `### ${title}\n\n`;
  md += `**What worked**\n\n`;
  for (const w of worked) md += `- ${stripInlineTags(w)}\n`;
  md += `\n**What hurt**\n\n`;
  for (const h of hurt) md += `- ${stripInlineTags(h)}\n`;
  if (punchline) md += `\n*${stripInlineTags(punchline)}*\n`;
  return md;
}

function renderLessonsGrid(block, slug) {
  const inner = extractArrayProp(block, 'lessons');
  const title = extractProp(block, 'title');
  const img = `![Lessons learned](${mediumAsset(slug, 'lessons.svg')})`;

  let md = `${img}\n\n`;
  if (title) md += `### ${title}\n\n`;
  if (!inner) return md;

  const lessons = splitObjectArray(inner).map((o) => ({
    title: objField(o, 'title'),
    body: objField(o, 'body'),
  }));

  lessons.forEach((l, i) => {
    md += `${i + 1}. **${l.title}** — ${l.body}\n`;
  });
  return md;
}

// Split an array of string literals (e.g. ["a", "b", `c`]) into raw entries
// preserving their unescaped contents. Used by WhatWorkedWhatHurt.
function splitTopLevelStrings(inner) {
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    const raw = m[1] ?? m[2] ?? m[3];
    out.push(
      raw
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\`/g, '`')
        .replace(/\\\\/g, '\\')
    );
  }
  return out;
}

async function generateImportUrl(_article) {
  console.log('\n📌 Medium Import Options:');
  console.log('1. Copy the converted content and paste directly into Medium');
  console.log('2. Import from your blog URL: https://umai-tech.com/blog/[slug]');
  console.log('3. Create a GitHub Gist and import from there');
  return null;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/convert-to-medium.js <blog-post-slug>');
    console.log('Example: node scripts/convert-to-medium.js building-aura-an-agentic-llm-gateway-in-rust');
    process.exit(1);
  }

  const slug = args[0];
  const blogPath = path.join(__dirname, '..', 'src', 'content', 'blog', `${slug}.mdx`);

  if (!fs.existsSync(blogPath)) {
    console.error(`❌ Blog post not found: ${blogPath}`);
    process.exit(1);
  }

  console.log(`🔄 Converting ${slug} to Medium format...`);

  const article = convertMDXToMedium(blogPath, slug);
  if (!article) {
    console.error('❌ Failed to convert article');
    process.exit(1);
  }

  const outputPath = path.join(__dirname, '..', 'dist', `${slug}-medium.md`);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tags = (article.tags || []).slice(0, MEDIUM_TAG_LIMIT);

  const mediumOutput = `# ${article.title}

${article.subtitle ? `*${article.subtitle}*\n\n` : ''}${article.content}

---

*Originally published at [umai-tech.com](${SITE_BASE}/blog/${slug})*

Tags: ${tags.join(', ')}`;

  fs.writeFileSync(outputPath, mediumOutput);
  console.log(`✅ Converted content saved to: ${outputPath}`);

  // Surface which SVGs the post references so the user knows what to upload.
  const referenced = [...mediumOutput.matchAll(/medium\/([\w-]+\.svg)/g)].map((m) => m[1]);
  const unique = Array.from(new Set(referenced));
  if (unique.length) {
    console.log('\n🖼  SVG assets referenced (upload these to public/images/blog/' + slug + '/medium/):');
    for (const f of unique) console.log('  - ' + f);
  }

  await generateImportUrl(article);

  console.log('\n✨ Next Steps:');
  console.log('1. Copy content from:', outputPath);
  console.log('2. Go to: https://medium.com/new-story');
  console.log('3. Paste and review formatting');
  console.log('4. Or use Medium Import: https://medium.com/p/import');
  console.log('   - Import from: https://umai-tech.com/blog/' + slug);
}

main().catch(console.error);

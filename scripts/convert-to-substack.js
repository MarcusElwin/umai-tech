#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert the Medium-format .md into a Substack-friendly variant.
 *
 * Substack's editor handles Markdown paste reasonably but:
 *  - Footnote refs ([^N]) don't auto-link; the trailing [^N]: blocks render as
 *    literal text. Inline the first link from each footnote instead.
 *  - Code-block language hints render fine but get no syntax highlighting.
 *  - Image references work via URL; Substack rehosts on paste.
 *  - Tables render fine.
 *
 * Usage: node scripts/convert-to-substack.js <blog-post-slug>
 *        node scripts/convert-to-substack.js building-aura-an-agentic-llm-gateway-in-rust
 */

function parseFootnoteDefinitions(md) {
  // Match: [^N]: text spanning until the next blank line followed by another
  // footnote or end of file. Substack output uses single-line defs in practice.
  const defs = new Map();
  const re = /^\[\^([0-9]+)\]:\s*([^\n]+(?:\n(?![\[#]|\[\^[0-9])[^\n]+)*)/gm;
  let m;
  while ((m = re.exec(md)) !== null) {
    defs.set(m[1], m[2].trim());
  }
  return defs;
}

// Pull the first markdown link out of a footnote definition.
// Returns { label, url } or null.
function firstLinkFrom(footnoteText) {
  const m = footnoteText.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!m) return null;
  return { label: m[1].replace(/[*_]/g, ''), url: m[2] };
}

function inlineFootnotes(md, defs) {
  let out = md;

  // 1) Replace each [^N] inline ref with a short inline link based on the
  //    first link in that footnote's definition. Keeps the source visible
  //    in the prose without needing a separate References section.
  out = out.replace(/\[\^([0-9]+)\]/g, (full, n) => {
    const def = defs.get(n);
    if (!def) return ''; // unknown ref — drop silently
    const link = firstLinkFrom(def);
    if (!link) return '';
    // Render as a small parenthetical "(source)" link rather than a superscript
    // number, which reads better in Substack body text.
    return ` ([source](${link.url}))`;
  });

  // 2) Remove the trailing footnote definitions block. We replace it with a
  //    consolidated "Sources" section so curious readers can still scan all
  //    references in one place.
  const sourcesLines = [];
  for (const [n, text] of [...defs.entries()].sort((a, b) => Number(a[0]) - Number(b[0]))) {
    sourcesLines.push(`${n}. ${text}`);
  }
  out = out.replace(/^\[\^[0-9]+\]:[\s\S]*?(?=\n## |\n---|\n$)/gm, '');
  // Cleanup: collapse the run of blank lines we just created.
  out = out.replace(/\n{3,}/g, '\n\n');

  // 3) If a "## References" heading exists, replace its body. Otherwise we
  //    don't add one — the inline ([source](...)) refs are enough.
  out = out.replace(
    /(## References\n+)([\s\S]*?)(?=\n---|\n$)/,
    (_, head) => `${head}${sourcesLines.join('\n\n')}\n`
  );

  return out;
}

function rewriteFooter(md, slug) {
  // Replace the "Originally published at" line with a Substack-friendly variant
  // that still credits the canonical post.
  return md.replace(
    /\*Originally published at \[umai-tech\.com\]\([^)]+\)\*\n\nTags: ([^\n]+)/,
    (_, tags) => {
      // Substack uses tags via the editor UI, not inline. Drop them into a
      // commented hint at the end so the author can copy them across manually.
      return [
        `*Originally published at [umai-tech.com](https://umai-tech.com/blog/${slug}).` +
          ` If you liked this, subscribe for the next one — the talk's deck and benchmark` +
          ` results land in a follow-up post.*`,
        ``,
        `<!-- Substack tags (set via the editor sidebar): ${tags} -->`,
      ].join('\n');
    }
  );
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node scripts/convert-to-substack.js <blog-post-slug>');
    process.exit(1);
  }
  const slug = args[0];
  const inputPath = path.join(__dirname, '..', 'dist', `${slug}-medium.md`);
  const outputPath = path.join(__dirname, '..', 'dist', `${slug}-substack.md`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Medium-format source not found: ${inputPath}`);
    console.error(`   Run: pnpm convert-to-medium ${slug}  first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const defs = parseFootnoteDefinitions(raw);

  let out = inlineFootnotes(raw, defs);
  out = rewriteFooter(out, slug);

  fs.writeFileSync(outputPath, out);

  const refCountBefore = (raw.match(/\[\^[0-9]+\]/g) || []).length;
  const refCountAfter = (out.match(/\[\^[0-9]+\]/g) || []).length;

  console.log(`✅ Substack-format file written: ${outputPath}`);
  console.log(`   Footnote defs parsed: ${defs.size}`);
  console.log(`   Inline [^N] refs:  ${refCountBefore} → ${refCountAfter} (should be 0)`);
  console.log('');
  console.log('✨ Next:');
  console.log(`   1. Open ${outputPath}`);
  console.log(`   2. Copy all → paste into https://substack.com/publish`);
  console.log(`   3. Add the cover image (recommend aura-hero.svg, or upload a PNG export)`);
  console.log(`   4. Set tags in the editor sidebar (see the HTML comment at the bottom)`);
}

main();
